'use client';

import React, { forwardRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { setAttr } from '@directus/visual-editing';

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
	const logoUrl = globals?.logo ? `${directusURL}/assets/${globals.logo}` : '/images/logo-white.svg';

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
				<div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-6 gap-8">
					{/* Kolom 1: Adresgegevens + Logo */}
					<div className="md:col-span-2 flex flex-col gap-12">
						<div
							className="text-[#42566E] text-[15px] leading-loose"
							data-directus={setAttr({
								collection: 'globals',
								item: globals.id,
								fields: ['address', 'zip_code', 'city', 'phone', 'email'],
								mode: 'modal',
							})}
						>
							<p>{globals.address || 'Lage dijk - noord 10'}</p>
							<p>
								{globals.zip_code && globals.city
									? `${globals.zip_code} ${globals.city}`
									: '3401 VA IJsselstein, Utrecht'}
							</p>
							<p>{globals.phone || '030 - 6880970'}</p>
							<p>{globals.email || 'info@deallesdrukker.nl'}</p>
						</div>

						<div className="flex">
							<Link href="/" className="inline-block">
								<div
									className="bg-[#f0972a] px-10 py-8 flex items-center justify-center min-w-[200px]"
									data-directus={setAttr({
										collection: 'globals',
										item: globals.id,
										fields: 'logo',
										mode: 'modal',
									})}
								>
									<Image
										src={logoUrl}
										alt="Hofmans"
										width={150}
										height={42}
										className="h-10 w-auto"
									/>
								</div>
							</Link>
						</div>
					</div>

					{/* Kolom 2: Leeg - zorgt voor ruimte in het midden */}
					<div className="hidden md:block md:col-span-2"></div>

					{/* Kolommen 3 + 4: Dynamische navigatie uit Directus */}
					{navigation?.items?.map((column) => (
						<div key={column.id} className="md:col-span-1">
							<h4
								className="text-[#42566E] font-bold text-2xl mb-8 font-heading"
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
								<ul className="space-y-4">
									{column.children.map((item) => (
										<li key={item.id}>
											<Link
												href={item.page?.permalink || item.url || '#'}
												className="text-[#42566E] text-base hover:text-[#f0972a] transition-colors"
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
		</footer>
	);
});

Footer.displayName = 'Footer';
export default Footer;
