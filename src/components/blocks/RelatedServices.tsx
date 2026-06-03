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
					<h2 className="mb-12 text-center text-3xl font-bold text-gray-800 md:mb-20 md:text-4xl lg:text-5xl">
						{data.headline}
					</h2>
				)}

				<div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
					{services.map((service, index) => (
						<Link
							key={service.id || index}
							href={`/diensten/${service.slug}`}
							className="group relative flex aspect-square items-center justify-center bg-gray-500 p-8 transition-colors hover:bg-gray-600"
						>
							<h3 className="relative z-10 text-2xl font-bold text-white md:text-3xl">{service.title}</h3>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
