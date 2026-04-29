import Link from 'next/link';
import DirectusImage from '@/components/shared/DirectusImage';
import Headline from '@/components/ui/Headline';
import Tagline from '@/components/ui/Tagline';
import { setAttr } from '@directus/visual-editing';

interface ServiceItem {
	id: string;
	title: string;
	slug?: string | null;
	image?: string | null;
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
		<section>
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

			<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				{services.map((service) => (
					<Link
						key={service.id}
						href={`/diensten/${service.slug}`}
						className="relative aspect-square flex items-center justify-center overflow-hidden group bg-gray-500"
					>
						{service.image && (
							<DirectusImage
								uuid={typeof service.image === 'string' ? service.image : (service.image as any)?.id}
								alt={service.title}
								fill
								sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
								className="object-cover transition-transform duration-300 group-hover:scale-105"
							/>
						)}
						<div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
						<h3 className="relative z-10 text-white text-2xl md:text-3xl font-bold text-center px-4">
							{service.title}
						</h3>
					</Link>
				))}
			</div>
		</section>
	);
}
