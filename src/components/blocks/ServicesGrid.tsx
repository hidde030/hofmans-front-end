import Link from 'next/link';
import DirectusImage from '@/components/shared/DirectusImage';
import Tagline from '@/components/ui/Tagline';
import Headline from '@/components/ui/Headline';
import { setAttr } from '@directus/visual-editing';

interface Service {
	id: string;
	title: string;
	slug?: string | null;
	image?: string | { id: string } | null;
}

interface ServicesGridData {
	id: string;
	tagline?: string | null;
	headline?: string | null;
	services?: Service[];
}

interface ServicesGridProps {
	data: ServicesGridData;
}

const ServicesGrid = ({ data }: ServicesGridProps) => {
	const { id, tagline, headline, services = [] } = data;

	return (
		<section className="py-16 md:py-24">
			<div className="container mx-auto px-4">
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

				<div
					className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
					data-directus={setAttr({
						collection: 'block_services_grid',
						item: id,
						fields: 'id',
						mode: 'popover',
					})}
				>
					{services.map((service) => {
						const imageId =
							service.image
								? typeof service.image === 'string'
									? service.image
									: service.image?.id
								: null;

						return (
							<Link
								key={service.id}
								href={`/diensten/${service.slug}`}
								className="relative aspect-square flex items-center justify-center overflow-hidden bg-gray-500 hover:bg-gray-600 transition-colors group"
							>
								{imageId && (
									<DirectusImage
										uuid={imageId}
										alt={service.title}
										fill
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
										className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
									/>
								)}
								<span className="relative z-10 text-white text-2xl md:text-3xl font-bold text-center px-4">
									{service.title}
								</span>
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default ServicesGrid;
