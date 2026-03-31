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


// Sociale media iconen die we ondersteunen
const SOCIAL_ICON_ORDER = ['linkedin', 'instagram', 'facebook'];

const Footer = forwardRef<HTMLElement, FooterProps>(({ navigation, globals }, ref) => {
	const directusURL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
	const logoUrl = globals?.logo ? `${directusURL}/assets/${globals.logo}` : '/images/logo-white.svg';

	// Bepaal sociale links: gebruik globals.social_links of val terug op lege array
	const socialLinks: { service: string; url: string }[] = globals?.social_links || [];

	// Haal sociale links op in de gewenste volgorde
	const orderedSocialLinks = SOCIAL_ICON_ORDER.map((service) =>
		socialLinks.find((s) => s.service.toLowerCase() === service),
	).filter(Boolean) as { service: string; url: string }[];

	// Splits de navigatie in twee kolommen: eerste helft = Diensten, tweede helft = Hofmans
	const allItems = navigation?.items || [];
	const half = Math.ceil(allItems.length / 2);
	const dienstenItems = allItems.slice(0, half);
	const hofmansItems = allItems.slice(half);

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
			{/* Bovenste sectie: sociale media balk */}
			<div className="bg-[#42566E] border-t border-b border-[#536678]">
				<div className="max-w-7xl mx-auto px-6 py-4 flex justify-end items-center gap-5">
					{orderedSocialLinks.map((social) => (
						<a
							key={social.service}
							href={social.url}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={social.service}
							className="hover:opacity-70 transition-opacity"
						>
							<Image
								src={`/icons/social/${social.service.toLowerCase()}.svg`}
								alt={`${social.service} icon`}
								width={24}
								height={24}
								className="invert"
							/>
						</a>
					))}

					{/* Toon standaard iconen als er geen sociale links zijn ingesteld */}
					{orderedSocialLinks.length === 0 &&
						SOCIAL_ICON_ORDER.map((service) => (
							<a
								key={service}
								href="#"
								aria-label={service}
								className="hover:opacity-70 transition-opacity"
							>
								<Image
									src={`/icons/social/${service}.svg`}
									alt={`${service} icon`}
									width={24}
									height={24}
									className="invert"
								/>
							</a>
						))}
				</div>
			</div>

			{/* Onderstc sectie: adres + links + logo */}
			<div className="bg-[#F5F8FB]">
				<div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Kolom 1: Adresgegevens */}
					<div
						className="text-[#42566E] text-sm leading-7"
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

					{/* Kolom 2: Diensten */}
					<div>
						<h4 className="text-[#42566E] font-bold text-base mb-3">Diensten</h4>
						<ul className="space-y-1">
							{dienstenItems.map((item) => (
								<li key={item.id}>
									<Link
										href={item.page?.permalink || item.url || '#'}
										className="text-[#42566E] text-sm hover:text-[#E87722] transition-colors"
									>
										{item.title}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Kolom 3: Hofmans */}
					<div>
						<h4 className="text-[#42566E] font-bold text-base mb-3">Hofmans</h4>
						<ul className="space-y-1">
							{hofmansItems.map((item) => (
								<li key={item.id}>
									<Link
										href={item.page?.permalink || item.url || '#'}
										className="text-[#42566E] text-sm hover:text-[#E87722] transition-colors"
									>
										{item.title}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Kolom 4: Oranje Hofmans logo blok */}
					<div className="flex md:justify-end">
						<Link href="/" className="inline-block">
							<div className="bg-[#E87722] px-6 py-4 flex items-center justify-center">
								<Image
									src={logoUrl}
									alt="Hofmans"
									width={120}
									height={34}
									className="h-8 w-auto"
								/>
							</div>
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
});

Footer.displayName = 'Footer';
export default Footer;
