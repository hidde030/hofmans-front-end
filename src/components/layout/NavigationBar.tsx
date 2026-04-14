'use client';

import { useState, forwardRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, Menu, X } from 'lucide-react';
import { setAttr } from '@directus/visual-editing';
import { cn } from '@/lib/utils';

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
		<header ref={ref} className="w-full z-50 relative shadow-sm">
			{/* Oranje topbalk met logo - Op mobile gecombineerd met menu */}
			<div className="bg-[#f0972a] py-3 md:py-5 px-8 md:px-6">
				<div className="max-w-7xl mx-auto flex items-center justify-between md:justify-center">
					<Link href="/" aria-label="Naar homepagina" className="flex-shrink-0">
						<Image
							src={logoUrl}
							alt="Hofmans"
							width={180}
							height={50}
							className="h-8 md:h-12 w-auto transition-all"
							priority
						/>
					</Link>

					{/* Mobile Menu Trigger - Verplaatst naar de oranje balk */}
					<button
						onClick={() => setMenuOpen(!menuOpen)}
						aria-label={menuOpen ? 'Sluit menu' : 'Open menu'}
						className="md:hidden text-white hover:text-white/80 transition-colors p-2"
					>
						{menuOpen ? <X size={28} /> : <Menu size={28} />}
					</button>
				</div>
			</div>

			{/* Witte navigatiebalk - Verborgen op mobile als dropdown dicht is */}
			<nav
				className={cn(
					'bg-white border-b border-gray-200 transition-all duration-300 ease-in-out',
					menuOpen ? 'block' : 'hidden md:block',
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
									className="text-[#42566E] text-[15px] font-medium hover:text-[#f0972a] transition-colors"
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
									className="text-[#42566E] text-[15px] font-medium hover:text-[#f0972a] transition-colors"
								>
									{item.title}
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* Mobile dropdown content */}
				<div className="md:hidden bg-white px-8 py-6 flex flex-col gap-4 shadow-inner">
					{navigation?.items?.map((item) => (
						<div key={item.id} className="border-b border-gray-50 pb-2 last:border-0 last:pb-0">
							{item.children && item.children.length > 0 ? (
								<Collapsible>
									<CollapsibleTrigger className="flex items-center justify-between text-[#42566E] text-base font-semibold hover:text-[#f0972a] transition-colors w-full text-left py-2">
										<span>{item.title}</span>
										<ChevronDown size={20} className="text-gray-400" />
									</CollapsibleTrigger>
									<CollapsibleContent className="pl-4 mt-2 flex flex-col gap-3 border-l-2 border-[#f0972a]/20 ml-1">
										{item.children.map((child) => (
											<Link
												key={child.id}
												href={child.page?.permalink || child.url || '#'}
												className="text-[#42566E] text-[15px] hover:text-[#f0972a] transition-colors py-1"
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
									className="text-[#42566E] text-base font-semibold hover:text-[#f0972a] transition-colors block py-2"
									onClick={handleLinkClick}
								>
									{item.title}
								</Link>
							)}
						</div>
					))}
				</div>
			</nav>
		</header>
	);
});

NavigationBar.displayName = 'NavigationBar';
export default NavigationBar;
