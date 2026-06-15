import Link from 'next/link';
import DirectusImage from '@/components/shared/DirectusImage';
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
		<section>
			<div className="container mx-auto px-4">
				{data.headline && (
					<h2 className="lg:text-5x l mb-12 text-center text-3xl font-bold text-gray-800 md:mb-20 md:text-4xl">
						{data.headline}
					</h2>
				)}

				<div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
					{services.map((service, index) => (
						<Link
							key={service.id || index}
							href={`/diensten/${service.slug}`}
							className="group relative flex aspect-square transform-gpu cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-gray-400 shadow-lg transition-all duration-300 hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
						>
							{service.image && (
								<DirectusImage
									uuid={typeof service.image === 'string' ? service.image : service.image.id}
									alt={service.title || ''}
									width={800}
									height={800}
									className="absolute inset-0 z-0 h-full w-full object-cover opacity-90 transition-transform group-hover:scale-105"
								/>
							)}
							<h3 className="relative z-10 text-2xl font-bold text-white md:text-3xl">{service.title}</h3>
							<div className="absolute bottom-4 z-20 flex translate-y-2 items-center gap-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
								<span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-orange-400 backdrop-blur-sm">
									Lees meer
								</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									className="h-5 w-5 text-orange-400 transition-transform duration-300 group-hover:translate-x-1"
									aria-hidden
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M13 5l7 7-7 7" />
								</svg>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
