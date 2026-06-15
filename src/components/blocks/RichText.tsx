'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Tagline from '@/components/ui/Tagline';
import Headline from '@/components/ui/Headline';
import Text from '@/components/ui/Text';
import { setAttr } from '@directus/visual-editing';

interface RichTextProps {
	data: {
		id: string;
		tagline?: string;
		headline?: string;
		content?: string;
		alignment?: 'left' | 'center' | 'right';
	};
	className?: string;
}

const RichText = ({ data, className }: RichTextProps) => {
	const { id, tagline, headline, content, alignment = 'left' } = data;

	const router = useRouter();

	useEffect(() => {
		const container = document.querySelector('.prose');
		const links = container?.querySelectorAll('a');

		links?.forEach((link) => {
			const href = link.getAttribute('href');
			if (href && href.startsWith('/')) {
				link.onclick = (event) => {
					event.preventDefault();
					router.push(href);
				};
			}
		});

		const iframes = container?.querySelectorAll('iframe');
		iframes?.forEach((iframe) => {
			const wrapper = document.createElement('div');
			wrapper.className = 'relative aspect-video';
			iframe.parentNode?.insertBefore(wrapper, iframe);
			wrapper.appendChild(iframe);

			iframe.style.position = 'absolute';
			iframe.style.top = '0';
			iframe.style.left = '0';
			iframe.style.width = '100%';
			iframe.style.height = '100%';
		});
	}, [content, router]);

	return (
		<div
			className={cn(
				'w-full space-y-6 [&_.prose]:text-inherit',
				alignment === 'center'
					? 'flex flex-col items-center text-center'
					: alignment === 'right'
						? 'flex flex-col items-end text-right'
						: 'text-left',
				className,
			)}
		>
			{tagline && (
				<Tagline
					tagline={tagline}
					data-directus={setAttr({
						collection: 'block_richtext',
						item: id,
						fields: 'tagline',
						mode: 'popover',
					})}
				/>
			)}
			{headline && (
				<Headline
					headline={headline}
					data-directus={setAttr({
						collection: 'block_richtext',
						item: id,
						fields: 'headline',
						mode: 'popover',
					})}
				/>
			)}
			{content && (
				<Text
					content={content}
					className="max-w-none"
					data-directus={setAttr({
						collection: 'block_richtext',
						item: id,
						fields: 'content',
						mode: 'drawer',
					})}
				/>
			)}
		</div>
	);
};

export default RichText;
