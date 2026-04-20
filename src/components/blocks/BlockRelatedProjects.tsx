import Link from 'next/link';
import DirectusImage from '@/components/shared/DirectusImage';
import { BlockRelatedProjects as BlockRelatedProjectsType } from '@/types/directus-schema';

interface Project {
	id: string;
	title: string;
	slug?: string | null;
	image?: string | null;
}

interface BlockRelatedProjectsProps {
	data: BlockRelatedProjectsType;
}

export default function BlockRelatedProjects({ data }: BlockRelatedProjectsProps) {
	const projects: Project[] = Array.isArray(data.projects)
		? data.projects.map((relation: any) => relation.projects_id).filter(Boolean)
		: [];

	if (!projects.length) return null;

	return (
		<section className="py-16 md:py-24">
			<div className="container mx-auto px-4">
				{data.headline && (
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-20 text-gray-800">
						{data.headline}
					</h2>
				)}

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
					{projects.map((project, index) => (
						<Link
							key={project.id || index}
							href={`/projecten/${project.slug}`}
							className="relative aspect-square flex items-center justify-center p-8 bg-gray-500 hover:bg-gray-600 transition-colors group overflow-hidden"
						>
							{project.image && (
								<DirectusImage
									uuid={project.image}
									alt={project.title}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover absolute inset-0 w-full h-full opacity-60 group-hover:opacity-50 transition-opacity"
								/>
							)}
							<h3 className="text-white text-2xl md:text-3xl font-bold z-10 relative">{project.title}</h3>
						</Link>
					))}
				</div>

				<div className="mt-12 flex justify-center">
					<Link
						href="/projecten"
						className="inline-block bg-accent text-white px-8 py-3 font-semibold hover:bg-accent/90 transition-colors"
					>
						meer
					</Link>
				</div>
			</div>
		</section>
	);
}
