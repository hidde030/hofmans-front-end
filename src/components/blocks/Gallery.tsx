'use client';

import { useEffect, useState } from 'react';
import DirectusImage from '@/components/shared/DirectusImage';
import Tagline from '../ui/Tagline';
import Headline from '@/components/ui/Headline';
import ButtonGroup from '@/components/blocks/ButtonGroup';
import type { ButtonProps } from '@/components/blocks/Button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { ArrowLeft, ArrowRight, ZoomIn, X } from 'lucide-react';
import { setAttr } from '@directus/visual-editing';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import type { DirectusFile } from '@/types/directus-schema';

interface GalleryItem {
	id: string;
	directus_file?: DirectusFile | string | null;
	sort?: number;
	title?: string;
	content?: string;
	overlay_text?: boolean | null;
	overlay_text_color?: string | null;
}

interface GalleryData {
	id: string;
	tagline?: string;
	headline?: string;
	items: GalleryItem[];
	display_type?: 'grid' | 'carousel' | null;
	disable_lightbox?: boolean | null;
	alignment?: 'left' | 'center' | 'right' | null;
	button_group?: {
		id: string;
		buttons: ButtonProps[];
	} | null;
}

interface GalleryProps {
	data: GalleryData;
}

const Gallery = ({ data }: GalleryProps) => {
	const { tagline, headline, items, id, display_type, disable_lightbox, alignment, button_group } = data;

	const [isLightboxOpen, setLightboxOpen] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);

	const sortedItems = [...items].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
	const isValidIndex = sortedItems.length > 0 && currentIndex >= 0 && currentIndex < sortedItems.length;

	const handleOpenLightbox = (index: number) => {
		if (disable_lightbox) return;
		setCurrentIndex(index);
		setLightboxOpen(true);
	};

	const handlePrev = () => {
		setCurrentIndex((prev) => (prev > 0 ? prev - 1 : sortedItems.length - 1));
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev < sortedItems.length - 1 ? prev + 1 : 0));
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (isLightboxOpen) {
			e.stopPropagation();
			switch (e.key) {
				case 'ArrowLeft':
					e.preventDefault();
					handlePrev();
					break;
				case 'ArrowRight':
					e.preventDefault();
					handleNext();
					break;
				case 'Escape':
					e.preventDefault();
					setLightboxOpen(false);
					break;
				default:
					break;
			}
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);

		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isLightboxOpen]);

	const renderGalleryItem = (item: GalleryItem, index: number) => {
		const isOverlay = item.overlay_text;
		const textColor = item.overlay_text_color;

		// Determine text color style
		let colorStyle = {};
		if (textColor) {
			if (textColor.toLowerCase() === 'orange') {
				colorStyle = { color: 'var(--accent-color)' };
			} else {
				colorStyle = { color: textColor };
			}
		} else {
			colorStyle = {
				color: item.directus_file ? 'var(--accent-color)' : '#ffffff',
			};
		}

		return (
			<div
				key={item.id}
				className={cn('group', !disable_lightbox && 'cursor-pointer')}
				onClick={() => handleOpenLightbox(index)}
				aria-label={`Gallery item ${item.id}`}
			>
				<div className="relative aspect-square overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
					{item.directus_file ? (
						<>
							<DirectusImage
								uuid={typeof item.directus_file === 'string' ? item.directus_file : (item.directus_file?.id ?? '')}
								alt={item.title || `Gallery item ${item.id}`}
								fill
								sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
								className="size-full object-cover"
							/>
							{isOverlay && <div className="absolute inset-0 bg-black/10" />}
						</>
					) : (
						<div
							className={cn(
								'flex h-full items-center justify-center text-sm',
								isOverlay ? 'bg-[#6B6564]' : 'bg-gray-100 text-gray-500',
							)}
						>
							{!isOverlay && 'Image not available'}
						</div>
					)}

					{isOverlay && item.title && (
						<div className="absolute inset-0 flex items-center justify-center p-4">
							<h3
								className="font-heading text-xl font-bold tracking-wide md:text-2xl"
								style={colorStyle}
								data-directus={setAttr({
									collection: 'block_gallery_items',
									item: item.id,
									fields: 'title',
									mode: 'popover',
								})}
							>
								{item.title}
							</h3>
						</div>
					)}

					{!disable_lightbox && (
						<div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
							<div className="scale-90 transform rounded-full bg-white/90 p-3 shadow-lg transition-transform duration-300 group-hover:scale-100">
								<ZoomIn className="size-6 text-gray-800" />
							</div>
						</div>
					)}
				</div>

				{!isOverlay && (item.title || item.content) && (
					<div className="mt-4 text-center">
						{item.title && (
							<h3
								className="line-clamp-1 font-heading text-lg font-bold text-[#42566E]"
								data-directus={setAttr({
									collection: 'block_gallery_items',
									item: item.id,
									fields: 'title',
									mode: 'popover',
								})}
							>
								{item.title}
							</h3>
						)}
						{item.content && (
							<p
								className="mt-1 line-clamp-2 text-sm text-[#42566E]/70"
								data-directus={setAttr({
									collection: 'block_gallery_items',
									item: item.id,
									fields: 'content',
									mode: 'popover',
								})}
							>
								{item.content}
							</p>
						)}
					</div>
				)}
			</div>
		);
	};

	const alignmentClasses = {
		left: 'text-left',
		center: 'text-center',
		right: 'text-right',
	}[alignment || 'left'];

	return (
		<section className="relative">
			{tagline && (
				<Tagline
					tagline={tagline}
					className={alignmentClasses}
					data-directus={setAttr({
						collection: 'block_gallery',
						item: id,
						fields: ['tagline', 'alignment'],
						mode: 'popover',
					})}
				/>
			)}
			{headline && (
				<Headline
					headline={headline}
					className={alignmentClasses}
					data-directus={setAttr({
						collection: 'block_gallery',
						item: id,
						fields: ['headline', 'alignment', 'tagline', 'button_group'],
						mode: 'popover',
					})}
				/>
			)}

			{sortedItems.length > 0 && (
				<div
					data-directus={setAttr({
						collection: 'block_gallery',
						item: id,
						fields: 'items',
						mode: 'modal',
					})}
					className="mt-8 px-16 lg:px-24"
				>
					{display_type === 'carousel' ? (
						<Carousel
							opts={{
								align: 'center',
								loop: true,
							}}
							className="mx-auto w-full max-w-6xl"
						>
							<div className="relative">
								<CarouselContent className="-ml-8">
									{sortedItems.map((item, index) => (
										<CarouselItem key={item.id} className="basis-[66.6%] pl-8 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
											{renderGalleryItem(item, index)}
										</CarouselItem>
									))}
								</CarouselContent>
								<div className="pointer-events-none absolute left-0 top-0 aspect-[1.5/1] w-full sm:aspect-[2/1] md:aspect-[3/1] lg:aspect-[4/1]">
									<CarouselPrevious className="pointer-events-auto absolute left-0 transition-colors hover:bg-[#42566E] hover:text-white lg:-left-12" />
									<CarouselNext className="pointer-events-auto absolute right-0 transition-colors hover:bg-[#42566E] hover:text-white lg:-right-12" />
								</div>
							</div>
						</Carousel>
					) : (
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
							{sortedItems.map((item, index) => renderGalleryItem(item, index))}
						</div>
					)}
				</div>
			)}

			{button_group && button_group.buttons?.length > 0 && (
				<div
					className={cn(
						'mt-12 px-16 lg:px-24',
						alignment === 'center' && 'flex justify-center',
						alignment === 'right' && 'flex justify-end',
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
							alignment === 'center' && 'justify-center',
							alignment === 'right' && 'justify-end',
							alignment === 'left' && 'justify-start',
						)}
					/>
				</div>
			)}

			{!disable_lightbox && isLightboxOpen && isValidIndex && (
				<Dialog open={isLightboxOpen} onOpenChange={setLightboxOpen}>
					<DialogContent
						className="z-50 flex max-h-full max-w-full items-center justify-center border-none bg-transparent p-2"
						hideCloseButton
					>
						<DialogTitle className="sr-only">Gallery Image</DialogTitle>
						<DialogDescription className="sr-only">
							Viewing image {currentIndex + 1} of {sortedItems.length}.
						</DialogDescription>

						<div className="relative flex h-[90vh] w-[90vw] items-center justify-center">
							<DirectusImage
								uuid={
									typeof sortedItems[currentIndex].directus_file === 'string'
										? sortedItems[currentIndex].directus_file
										: (sortedItems[currentIndex].directus_file?.id ?? '')
								}
								alt={`Gallery item ${sortedItems[currentIndex].id}`}
								width={1200}
								height={800}
								className="size-full object-contain"
							/>
						</div>
						<div className="absolute inset-x-0 bottom-4 flex items-center justify-between px-4">
							<button
								className="flex items-center gap-2 rounded-full bg-black bg-opacity-70 px-4 py-2 text-white hover:bg-opacity-90"
								onClick={handlePrev}
								aria-label="Previous"
							>
								<ArrowLeft className="size-8" />
								<span>Prev</span>
							</button>
							<button
								className="flex items-center gap-2 rounded-full bg-black bg-opacity-70 px-4 py-2 text-white hover:bg-opacity-90"
								onClick={handleNext}
								aria-label="Next"
							>
								<span>Next</span>
								<ArrowRight className="size-8" />
							</button>
						</div>
						<DialogClose asChild>
							<button
								className="absolute right-4 top-4 rounded-full bg-black bg-opacity-70 p-2 text-white hover:bg-opacity-90"
								aria-label="Close"
							>
								<X className="size-8" />
							</button>
						</DialogClose>
					</DialogContent>
				</Dialog>
			)}
		</section>
	);
};

export default Gallery;
