'use client';

import { useState, forwardRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, Menu, X } from 'lucide-react';
import { setAttr } from '@directus/visual-editing';

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
}

const NavigationBar = forwardRef<HTMLElement, NavigationBarProps>(({ navigation, globals }, ref) => {
	const [menuOpen, setMenuOpen] = useState(false);

	const directusURL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
	const logoUrl = globals?.logo ? `${directusURL}/assets/${globals.logo}` : '/images/logo-white.svg';

	const handleLinkClick = () => {
		setMenuOpen(false);
	};

	return (
		<header ref={ref} className="w-full z-50 sticky top-0 shadow-md">
			{/* Oranje topbalk met logo */}
			<div className="bg-[#E87722] flex items-center justify-center py-5 px-4">
				<Link href="/" aria-label="Naar homepagina">
					<Image
						src={logoUrl}
						alt="Hofmans"
						width={180}
						height={50}
						className="h-12 w-auto"
						priority
					/>
				</Link>
			</div>

			{/* Witte navigatiebalk */}
			<nav
				className="bg-white border-b border-gray-200"
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
									className="text-[#42566E] text-[15px] font-medium hover:text-[#E87722] transition-colors"
								>
									{item.title}
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
									className="text-[#42566E] text-[15px] font-medium hover:text-[#E87722] transition-colors"
								>
									{item.title}
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* Mobile navigatie */}
				<div className="md:hidden flex items-center justify-between px-6 py-3">
					<span className="text-[#42566E] text-sm font-medium">Menu</span>
					<button
						onClick={() => setMenuOpen(!menuOpen)}
						aria-label={menuOpen ? 'Sluit menu' : 'Open menu'}
						className="text-[#42566E] hover:text-[#E87722] transition-colors"
					>
						{menuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>

				{/* Mobile dropdown */}
				{menuOpen && (
					<div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-3">
						{navigation?.items?.map((item) => (
							<div key={item.id}>
								{item.children && item.children.length > 0 ? (
									<Collapsible>
										<CollapsibleTrigger className="flex items-center gap-1 text-[#42566E] text-[15px] font-medium hover:text-[#E87722] transition-colors w-full text-left focus:outline-none">
											<span>{item.title}</span>
											<ChevronDown size={16} />
										</CollapsibleTrigger>
										<CollapsibleContent className="ml-4 mt-2 flex flex-col gap-2">
											{item.children.map((child) => (
												<Link
													key={child.id}
													href={child.page?.permalink || child.url || '#'}
													className="text-[#42566E] text-sm hover:text-[#E87722] transition-colors"
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
										className="text-[#42566E] text-[15px] font-medium hover:text-[#E87722] transition-colors"
										onClick={handleLinkClick}
									>
										{item.title}
									</Link>
								)}
							</div>
						))}
					</div>
				)}
			</nav>
		</header>
	);
});

NavigationBar.displayName = 'NavigationBar';
export default NavigationBar;
