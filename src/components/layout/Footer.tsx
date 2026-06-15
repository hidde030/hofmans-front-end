'use client';

import React, { forwardRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { setAttr } from '@directus/visual-editing';
import Container from '@/components/ui/container';

interface SocialLink {
	service: string;
	url: string;
}

interface NavigationItem {
	id: string;
	title: string;
	url?: string | null;
	page?: { permalink?: string | null };
	children?: NavigationItem[];
}

interface FooterProps {
	navigation: { id?: string; items: NavigationItem[] };
	globals: {
		id: string;
		logo?: string | null;
		logo_dark_mode?: string | null;
		social_links?: { service: string; url: string }[];
		address?: string | null;
		zip_code?: string | null;
		city?: string | null;
		phone?: string | null;
		email?: string | null;
	};
}

const Footer = forwardRef<HTMLElement, FooterProps>(({ navigation, globals }, ref) => {
	const directusURL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
	const logoUrl = globals?.logo_dark_mode
		? `${directusURL}/assets/${globals.logo_dark_mode}`
		: '/images/logo-white.svg';

	return (
		<footer
			ref={ref}
			data-directus={
				navigation
					? setAttr({
							collection: 'navigation',
							item: navigation.id ?? null,
							fields: ['items'],
							mode: 'modal',
						})
					: undefined
			}
		>
			{/* Onderste sectie: adres + links + logo */}
			<div className="bg-[#F5F8FB]">
				<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 px-8 py-12 text-center md:flex-row md:items-start md:py-16 md:text-left">
					{/* Linkerkant: Adresgegevens + Logo */}
					<div className="flex flex-col items-center gap-8 md:items-start md:gap-12">
						<div
							className="text-[15px] leading-loose text-[#42566E]"
							data-directus={setAttr({
								collection: 'globals',
								item: globals.id,
								fields: ['address', 'zip_code', 'city', 'phone', 'email'],
								mode: 'modal',
							})}
						>
							<p className="font-semibold md:font-normal">{globals.address || 'Lage dijk - noord 10'}</p>
							<p>
								{globals.zip_code && globals.city
									? `${globals.zip_code} ${globals.city}`
									: '3401 VA IJsselstein, Utrecht'}
							</p>
							<p className="mt-2 font-bold text-accent md:mt-0">{globals.phone || '030 - 6880970'}</p>
							<p>{globals.email || 'info@deallesdrukker.nl'}</p>
						</div>

						<div className="flex">
							<Link
								href="/"
								className="inline-block"
								data-directus={setAttr({
									collection: 'globals',
									item: globals.id,
									fields: 'logo',
									mode: 'modal',
								})}
							>
								<Image src={logoUrl} alt="Hofmans" width={150} height={42} className="h-10 w-auto transition-opacity" />
							</Link>
						</div>
					</div>

					{/* Rechterkant: Dynamische navigatie uit Directus */}
					<div className="flex flex-col flex-wrap justify-center gap-12 sm:flex-row md:justify-start md:gap-24">
						{navigation?.items?.map((column) => (
							<div key={column.id} className="min-w-[150px]">
								<h4
									className="mb-4 font-heading text-xl font-bold text-[#42566E] md:mb-8 md:text-2xl"
									data-directus={setAttr({
										collection: 'navigation_item',
										item: column.id,
										fields: 'title',
										mode: 'popover',
									})}
								>
									{column.title}
								</h4>
								{column.children && column.children.length > 0 && (
									<ul className="space-y-3 md:space-y-4">
										{column.children.map((item) => (
											<li key={item.id}>
												<Link
													href={item.page?.permalink || item.url || '#'}
													className="text-base text-[#42566E] transition-colors hover:text-[#f0972a]"
												>
													{item.title}
												</Link>
											</li>
										))}
									</ul>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
});

Footer.displayName = 'Footer';
export default Footer;
