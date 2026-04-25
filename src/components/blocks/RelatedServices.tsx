import Link from 'next/link';
import { BlockRelatedService } from '@/types/directus-schema';

interface RelatedServicesProps {
	data: BlockRelatedService;
}

export default function RelatedServices({ data }: RelatedServicesProps) {
	const services = Array.isArray(data.services)
		? data.services.map((relation: any) => relation.services_id).filter(Boolean)
		: [];

	if (!services.length) return null;

	return (
		<section className="py-16 md:py-24">
			<div className="container mx-auto px-4">
				{data.headline && (
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-20 text-gray-800">
						{data.headline}
					</h2>
				)}

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
					{services.map((service, index) => (
						<Link
							key={service.id || index}
							href={`/diensten/${service.slug}`}
							className="relative aspect-square flex items-center justify-center p-8 bg-gray-500 hover:bg-gray-600 transition-colors group"
						>
							<h3 className="text-white text-2xl md:text-3xl font-bold z-10 relative">{service.title}</h3>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
