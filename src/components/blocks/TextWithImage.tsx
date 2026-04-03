'use client';

import { cn } from '@/lib/utils';
import Tagline from '@/components/ui/Tagline';
import Headline from '@/components/ui/Headline';
import Text from '@/components/ui/Text';
import DirectusImage from '@/components/shared/DirectusImage';
import { setAttr } from '@directus/visual-editing';

interface TextWithImageProps {
	data: {
		id: string;
		tagline?: string;
		headline?: string;
		content?: string;
		image?: string;
		image_position?: 'left' | 'right';
	};
	className?: string;
}

const TextWithImage = ({ data, className }: TextWithImageProps) => {
	const { id, tagline, headline, content, image, image_position = 'right' } = data;

	return (
		<div className={cn('mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center', className)}>
			<div className={cn('space-y-6', image_position === 'left' ? 'md:order-2' : 'md:order-1')}>
				{tagline && (
					<Tagline
						tagline={tagline}
						data-directus={setAttr({
							collection: 'block_text_image',
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
							collection: 'block_text_image',
							item: id,
							fields: 'headline',
							mode: 'popover',
						})}
					/>
				)}
				{content && (
					<Text
						content={content}
						data-directus={setAttr({
							collection: 'block_text_image',
							item: id,
							fields: 'content',
							mode: 'drawer',
						})}
					/>
				)}
			</div>
			{image && (
				<div
					className={cn(
						'relative w-full aspect-square md:aspect-auto md:h-full min-h-[300px]',
						image_position === 'left' ? 'md:order-1' : 'md:order-2',
					)}
					data-directus={setAttr({
						collection: 'block_text_image',
						item: id,
						fields: 'image',
						mode: 'popover',
					})}
				>
					<DirectusImage uuid={image} alt={headline || 'Image'} fill className="object-cover rounded-xl" />
				</div>
			)}
		</div>
	);
};

export default TextWithImage;
