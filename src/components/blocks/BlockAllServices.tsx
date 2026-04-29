import Link from 'next/link';
import DirectusImage from '@/components/shared/DirectusImage';
import { BlockAllServices as BlockAllServicesType } from '@/types/custom-blocks';

interface Service {
	id: string;
	title: string;
	slug?: string | null;
	image?: string | null;
}

interface BlockAllServicesProps {
	data: BlockAllServicesType & { services?: Service[] };
}

export default function BlockAllServices({ data }: BlockAllServicesProps) {
	const services: Service[] = Array.isArray(data.services) ? data.services : [];

	return (
		<section className="py-16 md:py-24">
			<div className="container mx-auto px-4">
				{data.headline && (
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-20 text-gray-800">
						{data.headline}
					</h2>
				)}

				{services.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
						{services.map((service) => (
							<Link
								key={service.id}
								href={`/diensten/${service.slug}`}
								className="relative aspect-square flex items-center justify-center p-8 bg-gray-500 hover:bg-gray-600 transition-colors group overflow-hidden"
							>
								{service.image && (
									<DirectusImage
										uuid={service.image}
										alt={service.title}
										fill
										sizes="(max-width: 768px) 100vw, 33vw"
										className="object-cover absolute inset-0 w-full h-full opacity-60 group-hover:opacity-50 transition-opacity"
									/>
								)}
								<h3 className="text-white text-2xl md:text-3xl font-bold z-10 relative">{service.title}</h3>
							</Link>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
