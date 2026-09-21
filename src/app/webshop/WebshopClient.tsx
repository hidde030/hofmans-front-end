'use client';

import Script from 'next/script';
import NavigationBar from '@/components/layout/NavigationBar';
import Footer from '@/components/layout/Footer';

interface WebshopClientProps {
	headerNavigation: any;
	globals: any;
}

export default function WebshopClient({ headerNavigation, globals }: WebshopClientProps) {
	return (
		<>
			<NavigationBar navigation={headerNavigation} globals={globals} />
			<main className="flex-grow bg-[#F5F8FB] py-12 md:py-20">
				<div className="mx-auto max-w-7xl px-6 text-center">
					<h1 className="mb-4 font-heading text-3xl font-bold text-[#42566E] md:text-5xl">
						Webshop
					</h1>
					<p className="mx-auto mb-10 max-w-xl text-base text-[#42566E] md:text-lg">
						Bestel eenvoudig visitekaartjes, flyers, posters en meer via onze online
						drukkerij.
					</p>

					{/* Print Solutions Widget */}
					<div id="print-widget-target" data-print-id="bf9e1e41-a5ed-4782-9e9e-bf0fee0fec7d" />
				</div>
			</main>
			<Script
				src="https://popup.print.com/widget.js?id=bf9e1e41-a5ed-4782-9e9e-bf0fee0fec7d"
				strategy="afterInteractive"
			/>
		</>
	);
}