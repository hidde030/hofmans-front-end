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
			<header ref={ref} className="w-full z-50 sticky top-0 shadow-sm">
				{/* Oranje topbalk met logo - Op mobile gecombineerd met menu */}
				<div
					className="py-3 md:py-10 px-8 md:px-6"
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
					<div className="max-w-7xl mx-auto flex items-center justify-between md:justify-center">
						{hideHomeLink ? (
							<div className="flex-shrink-0">
								<Image
									src={logoUrl}
									alt={globals?.title || 'Hofmans'}
									width={180}
									height={50}
									className="h-8 md:h-40 w-auto transition-all"
									priority
								/>
							</div>
						) : (
							<Link href="/" className="flex-shrink-0" onClick={handleLinkClick}>
								<Image
									src={logoUrl}
									alt={globals?.title || 'Hofmans'}
									width={180}
									height={50}
									className="h-8 md:h-40 w-auto transition-all"
									priority
								/>
							</Link>
						)}

						{/* Mobile Menu Trigger - Verplaatst naar de oranje balk */}
						<button
							onClick={() => setMenuOpen(!menuOpen)}
							aria-label={menuOpen ? 'Sluit menu' : 'Open menu'}
							className={cn(
								'md:hidden transition-all duration-300 p-2 relative size-10 flex items-center justify-center',
								hasCustomHeaderSettings ? 'text-orange-300' : 'text-white',
							)}
						>
							<div className="relative size-6">
								<X
									size={28}
									className={cn(
										'absolute inset-0 transition-all duration-300 ease-in-out transform',
										menuOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-45 opacity-0 scale-90',
									)}
								/>
								<Menu
									size={28}
									className={cn(
										'absolute inset-0 transition-all duration-300 ease-in-out transform',
										menuOpen ? 'rotate-45 opacity-0 scale-90' : 'rotate-0 opacity-100 scale-100',
									)}
								/>
							</div>
						</button>
					</div>
				</div>

				{/* Witte navigatiebalk - Verborgen op mobile als dropdown dicht is */}
				<nav
					className={cn(
						'bg-white/95 backdrop-blur-md border-t-2 border-b-2 border-black transition-all duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
						'md:static md:w-auto md:h-auto md:overflow-visible md:opacity-100 md:visible md:translate-y-0 md:scale-100 md:bg-white md:backdrop-blur-none',
						'absolute top-full left-0 w-full h-[calc(100dvh-4rem)] overflow-y-auto',
						menuOpen
							? 'opacity-100 visible translate-y-0 scale-100'
							: 'opacity-0 invisible -translate-y-2 scale-[0.98] pointer-events-none md:pointer-events-auto',
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
					<div className="max-w-7xl mx-auto px-6 hidden md:flex items-center justify-between py-3">
						{/* Links (links uitgelijnd) */}
						<ul className="flex items-center gap-8">
							{navigation?.items?.slice(0, Math.ceil((navigation?.items?.length || 0) - 1)).map((item) => (
								<li key={item.id}>
									<Link
										href={item.page?.permalink || item.url || '#'}
										className="text-[#42566E] text-[15px] font-semibold hover:text-[#f0972a] transition-all relative group py-1"
									>
										{item.title}
										<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#f0972a] transition-all group-hover:w-full" />
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
										className="text-[#42566E] text-[15px] font-semibold hover:text-[#f0972a] transition-all relative group py-1"
									>
										{item.title}
										<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#f0972a] transition-all group-hover:w-full" />
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Mobile dropdown content */}
					<div className="md:hidden p-8 flex flex-col gap-2 shadow-inner min-h-full pb-32">
						{navigation?.items?.map((item, index) => (
							<div
								key={item.id}
								className={cn(
									'w-full transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] transform',
									menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
								)}
								style={{ transitionDelay: `${index * 30}ms` }}
							>
								{item.children && item.children.length > 0 ? (
									<Collapsible>
										<CollapsibleTrigger className="flex items-center justify-between text-[#42566E] text-2xl font-bold hover:text-[#f0972a] hover:bg-orange-50/50 transition-all w-full text-left p-4 rounded-xl">
											<span>{item.title}</span>
											<ChevronDown size={24} className="text-gray-400" />
										</CollapsibleTrigger>
										<CollapsibleContent className="px-6 py-2 flex flex-col gap-4 border-l-4 border-[#f0972a]/20 ml-6 mt-1">
											{item.children.map((child) => (
												<Link
													key={child.id}
													href={child.page?.permalink || child.url || '#'}
													className="text-[#42566E] text-lg font-medium hover:text-[#f0972a] transition-colors py-1"
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
										className="text-[#42566E] text-2xl font-bold hover:text-[#f0972a] hover:bg-orange-50/50 transition-all flex items-center justify-between p-4 rounded-xl"
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
