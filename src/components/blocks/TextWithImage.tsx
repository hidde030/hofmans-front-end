'use client';

import { cn } from '@/lib/utils';
import Tagline from '@/components/ui/Tagline';
import Headline from '@/components/ui/Headline';
import Text from '@/components/ui/Text';
import DirectusImage from '@/components/shared/DirectusImage';
import ButtonGroup from '@/components/blocks/ButtonGroup';
import { setAttr } from '@directus/visual-editing';
import type { ButtonProps } from '@/components/blocks/Button';

interface TextWithImageProps {
	data: {
		id: string;
		tagline?: string;
		headline?: string;
		content?: string;
		image?: string;
		image_position?: 'left' | 'right';
		border?: 'none' | 'top' | 'bottom' | 'both';
		button_group?: {
			id: string;
			buttons: ButtonProps[];
		} | null;
	};
	className?: string;
}

const TextWithImage = ({ data, className }: TextWithImageProps) => {
	const { id, tagline, headline, content, image, image_position = 'right', button_group } = data;

	return (
		<div
			className={cn('mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center px-8', className)}
		>
			<div
				className={cn('space-y-6 text-center md:text-left', image_position === 'left' ? 'md:order-2' : 'md:order-1')}
			>
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
						className="text-3xl md:text-4xl lg:text-5xl"
						data-directus={setAttr({
							collection: 'block_text_image',
							item: id,
							fields: ['headline', 'button_group', 'border'],
							mode: 'popover',
						})}
					/>
				)}
				{content && (
					<Text
						content={content}
						className="text-base md:text-lg leading-relaxed"
						data-directus={setAttr({
							collection: 'block_text_image',
							item: id,
							fields: 'content',
							mode: 'drawer',
						})}
					/>
				)}
				{button_group && button_group.buttons?.length > 0 && (
					<div
						className="mt-8 flex justify-center md:justify-start"
						data-directus={setAttr({
							collection: 'block_button_group',
							item: button_group.id,
							fields: 'buttons',
							mode: 'modal',
						})}
					>
						<ButtonGroup buttons={button_group.buttons} className="justify-center md:justify-start" />
					</div>
				)}
			</div>
			{image && (
				<div
					className={cn(
						'relative w-full aspect-[4/3] md:aspect-square lg:aspect-[4/3] min-h-[250px] md:min-h-[400px]',
						image_position === 'left' ? 'md:order-1' : 'md:order-2',
					)}
					data-directus={setAttr({
						collection: 'block_text_image',
						item: id,
						fields: 'image',
						mode: 'popover',
					})}
				>
					<DirectusImage uuid={image} alt={headline || 'Image'} fill className="object-contain rounded-xl" />
				</div>
			)}
		</div>
	);
};

export default TextWithImage;
