'use client';

import { useState, forwardRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { setAttr } from '@directus/visual-editing';
import { cn } from '@/lib/utils';
import { getDirectusAssetURL } from '@/lib/directus/directus-utils';

interface NavigationItem {
	id: string;
	title: string;
	url?: string | null;
	page?: { permalink?: string | null };
	children?: NavigationItem[];
}

interface NavigationBarProps {
	navigation: { id?: string; items: NavigationItem[] };
	globals: any;
	customBackgroundColor?: string | null;
	customLogo?: any;
	hideHomeLink?: boolean;
	pageId?: string | null;
}

const NavigationBar = forwardRef<HTMLElement, NavigationBarProps>(
	({ navigation, globals, customBackgroundColor, customLogo, hideHomeLink, pageId }, ref) => {
		const [menuOpen, setMenuOpen] = useState(false);

		useEffect(() => {
			if (menuOpen) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}

			return () => {
				document.body.style.overflow = '';
			};
		}, [menuOpen]);

		const headerBgColor = customBackgroundColor || globals?.accent_color || '#f0972a';

		const hasCustomHeaderSettings = Boolean(customBackgroundColor || customLogo || hideHomeLink);
		const logoToUse = customLogo || globals?.logo;

		const logoUrl = logoToUse ? getDirectusAssetURL(logoToUse) : '/images/Logo.png';

		const handleLinkClick = () => {
			setMenuOpen(false);
		};

		return (
			<header ref={ref} className="sticky top-0 z-50 w-full shadow-sm">
				{/* Oranje topbalk met logo - Op mobile gecombineerd met menu */}
				<div
					className="px-8 py-3 md:px-6 md:py-10"
					style={{ backgroundColor: headerBgColor }}
					data-directus={
						pageId && hasCustomHeaderSettings
							? setAttr({
									collection: 'pages',
									item: pageId,
									fields: ['header_background_color', 'header_logo', 'hide_home_link'],
									mode: 'modal',
								})
							: globals
								? setAttr({
										collection: 'globals',
										item: globals.id ?? null,
										fields: ['logo', 'accent_color'],
										mode: 'modal',
									})
								: undefined
					}
				>
					<div className="mx-auto flex max-w-7xl items-center justify-between md:justify-center">
						{hideHomeLink ? (
							<div className="flex-shrink-0">
								<Image
									src={logoUrl}
									alt={globals?.title || 'Hofmans'}
									width={600}
									height={200}
									className="h-14 w-auto transition-all md:h-20"
									priority
								/>
							</div>
						) : (
							<Link href="/" className="flex-shrink-0" onClick={handleLinkClick}>
								<Image
									src={logoUrl}
									alt={globals?.title || 'Hofmans'}
									width={600}
									height={200}
									className="h-14 w-auto transition-all md:h-20"
									priority
								/>
							</Link>
						)}

						{/* Mobile Menu Trigger - Verplaatst naar de oranje balk */}
						<button
							onClick={() => setMenuOpen(!menuOpen)}
							aria-label={menuOpen ? 'Sluit menu' : 'Open menu'}
							className={cn(
								'relative flex size-10 items-center justify-center p-2 transition-all duration-300 md:hidden',
								hasCustomHeaderSettings ? 'text-orange-300' : 'text-white',
							)}
						>
							<div className="relative size-6">
								<X
									size={28}
									className={cn(
										'absolute inset-0 transform text-white transition-all duration-300 ease-in-out',
										menuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-45 scale-90 opacity-0',
										hasCustomHeaderSettings ? 'text-orange-300' : 'text-white',
									)}
								/>
								<Menu
									size={28}
									className={cn(
										'absolute inset-0 transform text-white transition-all duration-300 ease-in-out',
										menuOpen ? 'rotate-45 scale-90 opacity-0' : 'rotate-0 scale-100 opacity-100',
										hasCustomHeaderSettings ? 'text-orange-300' : 'text-white',
									)}
								/>
							</div>
						</button>
					</div>
				</div>

				{/* Witte navigatiebalk - Verborgen op mobile als dropdown dicht is */}
				<nav
					className={cn(
						'border-b-2 border-t-2 border-black bg-white/95 backdrop-blur-md transition-all duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
						'md:visible md:static md:h-auto md:w-auto md:translate-y-0 md:scale-100 md:overflow-visible md:bg-white md:opacity-100 md:backdrop-blur-none',
						'absolute left-0 top-full h-[calc(100dvh-4rem)] w-full overflow-y-auto',
						menuOpen
							? 'visible translate-y-0 scale-100 opacity-100'
							: 'pointer-events-none invisible -translate-y-2 scale-[0.98] opacity-0 md:pointer-events-auto',
					)}
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
					{/* Desktop navigatie */}
					<div className="mx-auto hidden max-w-7xl items-center justify-between px-6 py-3 md:flex">
						{/* Links (links uitgelijnd) */}
						<ul className="flex items-center gap-8">
							{navigation?.items?.slice(0, Math.ceil((navigation?.items?.length || 0) - 1)).map((item) => (
								<li key={item.id}>
									<Link
										href={item.page?.permalink || item.url || '#'}
										className="group relative py-1 text-[15px] font-semibold text-[#42566E] transition-all hover:text-[#f0972a]"
									>
										{item.title}
										<span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#f0972a] transition-all group-hover:w-full" />
									</Link>
								</li>
							))}
						</ul>

						{/* Rechts uitgelijnd item (Over ons) */}
						<ul className="flex items-center">
							{navigation?.items?.slice(-1).map((item) => (
								<li key={item.id}>
									<Link
										href={item.page?.permalink || item.url || '#'}
										className="group relative py-1 text-[15px] font-semibold text-[#42566E] transition-all hover:text-[#f0972a]"
									>
										{item.title}
										<span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#f0972a] transition-all group-hover:w-full" />
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Mobile dropdown content */}
					<div className="flex min-h-full flex-col gap-2 p-8 pb-32 shadow-inner md:hidden">
						{navigation?.items?.map((item, index) => (
							<div
								key={item.id}
								className={cn(
									'w-full transform transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
									menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
								)}
								style={{ transitionDelay: `${index * 30}ms` }}
							>
								{item.children && item.children.length > 0 ? (
									<Collapsible>
										<CollapsibleTrigger className="flex w-full items-center justify-between rounded-xl p-4 text-left text-2xl font-bold text-[#42566E] transition-all hover:bg-orange-50/50 hover:text-[#f0972a]">
											<span>{item.title}</span>
											<ChevronDown size={24} className="text-gray-400" />
										</CollapsibleTrigger>
										<CollapsibleContent className="ml-6 mt-1 flex flex-col gap-4 border-l-4 border-[#f0972a]/20 px-6 py-2">
											{item.children.map((child) => (
												<Link
													key={child.id}
													href={child.page?.permalink || child.url || '#'}
													className="py-1 text-lg font-medium text-[#42566E] transition-colors hover:text-[#f0972a]"
													onClick={handleLinkClick}
												>
													{child.title}
												</Link>
											))}
										</CollapsibleContent>
									</Collapsible>
								) : (
									<Link
										href={item.page?.permalink || item.url || '#'}
										className="flex items-center justify-between rounded-xl p-4 text-2xl font-bold text-[#42566E] transition-all hover:bg-orange-50/50 hover:text-[#f0972a]"
										onClick={handleLinkClick}
									>
										<span>{item.title}</span>
										<ChevronRight size={20} className="text-gray-300" />
									</Link>
								)}
							</div>
						))}
					</div>
				</nav>
			</header>
		);
	},
);

NavigationBar.displayName = 'NavigationBar';
export default NavigationBar;
