import Link from 'next/link';
import DirectusImage from '@/components/shared/DirectusImage';
import Headline from '@/components/ui/Headline';
import Tagline from '@/components/ui/Tagline';
import { setAttr } from '@directus/visual-editing';

interface ServiceItem {
	id: string;
	title: string;
	slug?: string | null;
	image?: string | { id: string } | null;
}

interface ServicesGridData {
	id: string;
	headline?: string | null;
	tagline?: string | null;
	services?: ServiceItem[];
}

interface ServicesGridProps {
	data: ServicesGridData;
}

export default function ServicesGrid({ data }: ServicesGridProps) {
	const { id, headline, tagline, services = [] } = data;

	return (
		<section className="px-4">
			<div className="text-center">
				{tagline && (
					<Tagline
						tagline={tagline}
						data-directus={setAttr({
							collection: 'block_services_grid',
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
							collection: 'block_services_grid',
							item: id,
							fields: 'headline',
							mode: 'popover',
						})}
					/>
				)}
			</div>

			<div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
				{services.map((service) => {
					if (!service.slug) return null;
					const imageUuid = typeof service.image === 'string' ? service.image : service.image?.id;

					return (
						<Link
							key={service.id}
							href={`/diensten/${service.slug}`}
							className="group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-gray-400 shadow-lg transition-all duration-300 hover:shadow-2xl"
						>
							{imageUuid && (
								<DirectusImage
									uuid={imageUuid}
									alt={service.title}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
									className="object-cover transition-transform duration-300 group-hover:scale-105"
								/>
							)}
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent transition-colors duration-300 group-hover:from-black/50 group-hover:via-black/20" />
							<h3 className="relative z-10 px-4 text-center text-2xl font-bold text-white drop-shadow-lg md:text-3xl">
								{service.title}
							</h3>
						</Link>
					);
				})}
			</div>
		</section>
	);
}
