'use client';

import { cn } from '@/lib/utils';
import Tagline from '@/components/ui/Tagline';
import Headline from '@/components/ui/Headline';
import DirectusImage from '@/components/shared/DirectusImage';
import { setAttr } from '@directus/visual-editing';
import { ChevronRight } from 'lucide-react';

interface TeamMember {
	id: string;
	name?: string;
	role?: string;
	image?: string;
}

interface TeamProps {
	data: {
		id: string;
		tagline?: string;
		headline?: string;
		members?: TeamMember[];
	};
	className?: string;
}

const Team = ({ data, className }: TeamProps) => {
	const { id, tagline, headline, members = [] } = data;

	return (
		<section className={cn('mx-auto max-w-7xl px-6 py-16', className)}>
			{(tagline || headline) && (
				<div className="mb-16 text-center">
					{tagline && (
						<Tagline
							tagline={tagline}
							data-directus={setAttr({
								collection: 'block_team',
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
								collection: 'block_team',
								item: id,
								fields: 'headline',
								mode: 'popover',
							})}
						/>
					)}
				</div>
			)}

			<div className="relative">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-16">
					{members.map((member) => (
						<div key={member.id} className="flex flex-col items-center text-center">
							<div
								className="relative aspect-[4/5] w-full mb-8 overflow-hidden bg-gray-100"
								data-directus={setAttr({
									collection: 'block_team_members',
									item: member.id,
									fields: 'image',
									mode: 'popover',
								})}
							>
								{member.image ? (
									<DirectusImage
										uuid={member.image}
										alt={member.name || 'Team member'}
										fill
										className="object-cover"
									/>
								) : (
									<div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
										Geen afbeelding
									</div>
								)}
							</div>
							<div className="space-y-1">
								<h3
									className="font-bold text-xl text-[#42566E] font-heading"
									data-directus={setAttr({
										collection: 'block_team_members',
										item: member.id,
										fields: 'name',
										mode: 'popover',
									})}
								>
									{member.name}
								</h3>
								<p
									className="text-base text-[#42566E]/80"
									data-directus={setAttr({
										collection: 'block_team_members',
										item: member.id,
										fields: 'role',
										mode: 'popover',
									})}
								>
									{member.role}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* Visual carousel element from design */}
				{members.length > 3 && (
					<button className="absolute -right-4 md:-right-8 top-1/3 -translate-y-1/2 bg-[#f0972a] p-4 rounded-full text-white shadow-xl hidden lg:flex items-center justify-center hover:bg-[#d88624] transition-all hover:scale-110 active:scale-95 group z-10">
						<ChevronRight className="w-8 h-8 transition-transform group-hover:translate-x-0.5" />
					</button>
				)}
			</div>
		</section>
	);
};

export default Team;
