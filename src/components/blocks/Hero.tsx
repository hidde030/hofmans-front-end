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
		layout: 'image_left' | 'image_center' | 'image_right' | 'image_cover';
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
	const { id, layout, tagline, headline, subtitle, description, phone, email, image, button_group } = data;

	return (
		<section
			className={cn(
				'relative w-full mx-auto flex flex-col gap-8 md:gap-12 px-8',
				layout === 'image_center'
					? 'items-center text-center'
					: layout === 'image_cover'
						? 'items-center justify-center text-center min-h-[60vh] md:min-h-[70vh] overflow-hidden'
						: layout === 'image_left'
							? 'md:flex-row-reverse items-center text-center md:text-left'
							: 'md:flex-row items-center text-center md:text-left',
			)}
		>
			<div
				className={cn(
					'flex flex-col gap-4 w-full relative z-10',
					layout === 'image_center' || layout === 'image_cover'
						? 'md:w-3/4 xl:w-2/3 items-center'
						: 'md:w-1/2 items-center md:items-start',
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
						'text-3xl sm:text-4xl md:text-5xl lg:text-7xl break-words',
						layout === 'image_cover' && 'text-white'
					)}
					data-directus={setAttr({
						collection: 'block_hero',
						item: id,
						fields: 'headline',
						mode: 'popover',
					})}
				/>
				{subtitle && (
					<div
						className={cn(
							"text-lg font-medium tracking-tight text-foreground",
							layout === 'image_cover' && 'text-white/90'
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
							'text-base md:text-lg max-w-2xl',
							layout === 'image_cover' && 'prose-invert text-white'
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
					<div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mt-6 md:mt-8">
						{phone && (
							<a
								href={`tel:${phone.replace(/\s+/g, '')}`}
								className={cn(
									"text-base font-bold hover:text-accent transition-colors",
									layout === 'image_cover' && 'text-white'
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
									"text-base font-bold hover:text-accent transition-colors",
									layout === 'image_cover' && 'text-white'
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
							(layout === 'image_center' || layout === 'image_cover') && 'flex justify-center'
						)}
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
						layout === 'image_cover' ? 'absolute inset-0 z-0' : 'relative w-full',
						layout !== 'image_cover' &&
						(layout === 'image_center' ? 'h-[300px] md:h-[400px] mt-8' : 'aspect-square md:aspect-auto md:w-1/2 h-auto md:h-[562px]'),
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
						className={cn(
							'rounded-2xl',
							layout === 'image_cover' ? 'object-cover rounded-none' : 'object-cover'
						)}
					/>
					{layout === 'image_cover' && <div className="absolute inset-0 bg-black/50" />}
				</div>
			)}
		</section>
	);
}
