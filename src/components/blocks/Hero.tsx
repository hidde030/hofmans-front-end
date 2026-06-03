'use client';

import Tagline from '../ui/Tagline';
import Headline from '@/components/ui/Headline';
import BaseText from '@/components/ui/Text';
import DirectusImage from '@/components/shared/DirectusImage';
import ButtonGroup from '@/components/blocks/ButtonGroup';
import { cn } from '@/lib/utils';
import { setAttr } from '@directus/visual-editing';

interface HeroProps {
	data: {
		id: string;
		tagline?: string | null;
		headline?: string | null;
		subtitle?: string | null;
		description?: string | null;
		phone?: string | null;
		email?: string | null;
		layout: 'image_left' | 'image_center' | 'image_right' | 'image_cover' | 'no_image';
		alignment?: 'left' | 'center' | 'right' | null;
		full_width?: boolean | null;
		image?: string | null;
		button_group?: {
			id: string;
			buttons: Array<{
				id: string;
				label: string | null;
				variant: string | null;
				url: string | null;
				type: 'url' | 'page' | 'post';
				pagePermalink?: string | null;
				postSlug?: string | null;
			}>;
		} | null;
	};
}

export default function Hero({ data }: HeroProps) {
	const {
		id,
		layout,
		tagline,
		headline,
		subtitle,
		description,
		phone,
		email,
		image,
		button_group,
		alignment,
		full_width,
	} = data;

	const alignmentClasses = {
		left: 'text-left items-start',
		center: 'text-center items-center',
		right: 'text-right items-end',
	};

	const currentAlignment =
		alignment || (layout === 'image_center' || layout === 'image_cover' || layout === 'no_image' ? 'center' : 'left');

	return (
		<section
			className={cn(
				'relative mx-auto flex w-full flex-col gap-8 px-8 md:gap-12',
				layout === 'image_center' || layout === 'no_image'
					? cn('items-center', alignmentClasses[currentAlignment])
					: layout === 'image_cover'
						? cn(
								'min-h-[60vh] items-center justify-center overflow-hidden md:min-h-[70vh]',
								alignmentClasses[currentAlignment],
							)
						: layout === 'image_left'
							? 'items-center text-center md:flex-row-reverse md:text-left'
							: 'items-center text-center md:flex-row md:text-left',
			)}
		>
			<div
				className={cn(
					'relative z-10 flex w-full flex-col gap-4',
					full_width || layout === 'no_image'
						? cn('w-full', alignmentClasses[currentAlignment])
						: layout === 'image_center' || layout === 'image_cover'
							? cn('md:w-3/4 xl:w-2/3', alignmentClasses[currentAlignment])
							: 'items-center md:w-1/2 md:items-start',
				)}
			>
				<Tagline
					tagline={tagline}
					className={cn(layout === 'image_cover' && 'text-white')}
					data-directus={setAttr({
						collection: 'block_hero',
						item: id,
						fields: 'tagline',
						mode: 'popover',
					})}
				/>
				<Headline
					headline={headline}
					className={cn(
						'break-words text-3xl sm:text-4xl md:text-5xl lg:text-7xl',
						layout === 'image_cover' && 'text-white',
					)}
					data-directus={setAttr({
						collection: 'block_hero',
						item: id,
						fields: ['headline', 'alignment', 'full_width'],
						mode: 'popover',
					})}
				/>
				{subtitle && (
					<div
						className={cn(
							'text-lg font-medium tracking-tight text-foreground',
							layout === 'image_cover' && 'text-white/90',
						)}
						data-directus={setAttr({
							collection: 'block_hero',
							item: id,
							fields: 'subtitle',
							mode: 'popover',
						})}
					>
						{subtitle}
					</div>
				)}
				{description && (
					<BaseText
						content={description}
						className={cn(
							'text-base md:text-lg',
							!full_width && layout !== 'no_image' ? 'max-w-2xl' : 'max-w-none',
							layout === 'image_cover' && 'prose-invert text-white',
						)}
						data-directus={setAttr({
							collection: 'block_hero',
							item: id,
							fields: 'description',
							mode: 'popover',
						})}
					/>
				)}
				{(phone || email) && (
					<div
						className={cn(
							'mt-6 flex flex-col items-center gap-4 sm:flex-row sm:gap-8 md:mt-8',
							currentAlignment === 'center' && 'justify-center',
							currentAlignment === 'right' && 'justify-end',
						)}
					>
						{phone && (
							<a
								href={`tel:${phone.replace(/\s+/g, '')}`}
								className={cn(
									'text-base font-bold transition-colors hover:text-accent',
									layout === 'image_cover' && 'text-white',
								)}
								data-directus={setAttr({
									collection: 'block_hero',
									item: id,
									fields: 'phone',
									mode: 'popover',
								})}
							>
								{phone}
							</a>
						)}
						{email && (
							<a
								href={`mailto:${email}`}
								className={cn(
									'text-base font-bold transition-colors hover:text-accent',
									layout === 'image_cover' && 'text-white',
								)}
								data-directus={setAttr({
									collection: 'block_hero',
									item: id,
									fields: 'email',
									mode: 'popover',
								})}
							>
								{email}
							</a>
						)}
					</div>
				)}
				{button_group && button_group.buttons.length > 0 && (
					<div
						className={cn(
							'mt-8 w-full sm:w-auto',
							currentAlignment === 'center' && 'flex justify-center',
							currentAlignment === 'right' && 'flex justify-end',
						)}
						data-directus={setAttr({
							collection: 'block_button_group',
							item: button_group.id,
							fields: 'buttons',
							mode: 'modal',
						})}
					>
						<ButtonGroup
							buttons={button_group.buttons}
							className={cn(
								currentAlignment === 'center' && 'justify-center',
								currentAlignment === 'right' && 'justify-end',
								currentAlignment === 'left' && 'justify-start',
							)}
						/>
					</div>
				)}
			</div>
			{image && layout !== 'no_image' && (
				<div
					className={cn(
						layout === 'image_cover' ? 'absolute inset-0 z-0' : 'relative w-full',
						layout !== 'image_cover' &&
							(layout === 'image_center'
								? 'mt-8 h-[300px] md:h-[400px]'
								: 'aspect-square h-auto md:aspect-auto md:h-[562px] md:w-1/2'),
					)}
					data-directus={setAttr({
						collection: 'block_hero',
						item: id,
						fields: ['image', 'layout'],
						mode: 'modal',
					})}
				>
					<DirectusImage
						uuid={image}
						alt={tagline || headline || 'Hero Image'}
						fill
						sizes={layout === 'image_center' || layout === 'image_cover' ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
						className={cn('rounded-2xl', layout === 'image_cover' ? 'rounded-none object-cover' : 'object-cover')}
					/>
					{layout === 'image_cover' && <div className="absolute inset-0 bg-black/50" />}
				</div>
			)}
		</section>
	);
}
