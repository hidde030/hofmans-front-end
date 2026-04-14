'use client';

import { useEffect, useState } from 'react';
import DirectusImage from '@/components/shared/DirectusImage';
import Tagline from '../ui/Tagline';
import Headline from '@/components/ui/Headline';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { ArrowLeft, ArrowRight, ZoomIn, X } from 'lucide-react';
import { setAttr } from '@directus/visual-editing';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface GalleryItem {
	id: string;
	directus_file: string;
	sort?: number;
	title?: string;
	content?: string;
}

interface GalleryData {
	id: string;
	tagline?: string;
	headline?: string;
	items: GalleryItem[];
	display_type?: 'grid' | 'carousel' | null;
	disable_lightbox?: boolean | null;
}

interface GalleryProps {
	data: GalleryData;
}

const Gallery = ({ data }: GalleryProps) => {
	const { tagline, headline, items, id, display_type, disable_lightbox } = data;

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

	const renderGalleryItem = (item: GalleryItem, index: number) => (
		<div
			key={item.id}
			className={cn('group', !disable_lightbox && 'cursor-pointer')}
			onClick={() => handleOpenLightbox(index)}
			aria-label={`Gallery item ${item.id}`}
		>
			<div className="relative aspect-square overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
				{item.directus_file ? (
					<DirectusImage
						uuid={item.directus_file}
						alt={item.title || `Gallery item ${item.id}`}
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="flex items-center justify-center h-full bg-gray-100 text-sm text-gray-500">
						Image not available
					</div>
				)}
				{!disable_lightbox && (
					<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity duration-300">
						<div className="bg-white/90 p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
							<ZoomIn className="size-6 text-gray-800" />
						</div>
					</div>
				)}
			</div>
			{(item.title || item.content) && (
				<div className="mt-4 text-center px-2">
					{item.title && (
						<h3
							className="text-lg font-bold text-[#42566E] font-heading line-clamp-1"
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
							className="text-sm text-[#42566E]/70 line-clamp-2 mt-1"
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

	return (
		<section className="relative px-4 sm:px-6 lg:px-8">
			{tagline && (
				<Tagline
					tagline={tagline}
					data-directus={setAttr({
						collection: 'block_gallery',
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
						collection: 'block_gallery',
						item: id,
						fields: 'headline',
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
					className="mt-8"
				>
					{display_type === 'carousel' ? (
						<Carousel
							opts={{
								align: 'start',
								loop: true,
							}}
							className="w-full max-w-6xl mx-auto"
						>
							<CarouselContent className="-ml-4">
								{sortedItems.map((item, index) => (
									<CarouselItem key={item.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3">
										{renderGalleryItem(item, index)}
									</CarouselItem>
								))}
							</CarouselContent>
							<div className="hidden sm:block">
								<CarouselPrevious className="-left-12 hover:bg-[#42566E] hover:text-white transition-colors" />
								<CarouselNext className="-right-12 hover:bg-[#42566E] hover:text-white transition-colors" />
							</div>
						</Carousel>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
							{sortedItems.map((item, index) => renderGalleryItem(item, index))}
						</div>
					)}
				</div>
			)}

			{!disable_lightbox && isLightboxOpen && isValidIndex && (
				<Dialog open={isLightboxOpen} onOpenChange={setLightboxOpen}>
					<DialogContent
						className="flex max-w-full max-h-full items-center justify-center p-2 bg-transparent border-none z-50"
						hideCloseButton
					>
						<DialogTitle className="sr-only">Gallery Image</DialogTitle>
						<DialogDescription className="sr-only">
							Viewing image {currentIndex + 1} of {sortedItems.length}.
						</DialogDescription>

						<div className="relative flex justify-center items-center w-[90vw] h-[90vh]">
							<DirectusImage
								uuid={sortedItems[currentIndex].directus_file}
								alt={`Gallery item ${sortedItems[currentIndex].id}`}
								width={1200}
								height={800}
								className="size-full object-contain"
							/>
						</div>
						<div className="absolute bottom-4 inset-x-0 flex justify-between items-center px-4">
							<button
								className="flex items-center gap-2 text-white bg-black bg-opacity-70 rounded-full px-4 py-2 hover:bg-opacity-90"
								onClick={handlePrev}
								aria-label="Previous"
							>
								<ArrowLeft className="size-8" />
								<span>Prev</span>
							</button>
							<button
								className="flex items-center gap-2 text-white bg-black bg-opacity-70 rounded-full px-4 py-2 hover:bg-opacity-90"
								onClick={handleNext}
								aria-label="Next"
							>
								<span>Next</span>
								<ArrowRight className="size-8" />
							</button>
						</div>
						<DialogClose asChild>
							<button
								className="absolute top-4 right-4 text-white bg-black bg-opacity-70 rounded-full p-2 hover:bg-opacity-90"
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
