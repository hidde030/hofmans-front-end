import '@/styles/globals.css';
import '@/styles/fonts.css';
import { ReactNode } from 'react';
import { Metadata } from 'next';

import PlausibleTracker from '@/components/PlausibleTracker';
import VisualEditingLayout from '@/components/layout/VisualEditingLayout';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { fetchSiteData } from '@/lib/directus/fetchers';
import { getDirectusAssetURL } from '@/lib/directus/directus-utils';
import { organizationSchema, serializeJsonLd } from '@/lib/seo/json-ld';

export async function generateMetadata(): Promise<Metadata> {
	const { globals } = await fetchSiteData();

	const siteTitle = globals?.title || 'Simple CMS';
	const siteDescription = globals?.description || 'A starter CMS template powered by Next.js and Directus.';
	const faviconURL = globals?.favicon ? getDirectusAssetURL(globals.favicon) : '/favicon.ico';

	return {
		title: {
			default: siteTitle,
			template: `%s | ${siteTitle}`,
		},
		description: siteDescription,
		icons: {
			icon: faviconURL,
		},
	};
}

export default async function RootLayout({ children }: { children: ReactNode }) {
	const { globals, footerNavigation } = await fetchSiteData();
	const accentColor = globals?.accent_color || '#6644ff';

	const orgJsonLd = organizationSchema(globals);
	const orgJsonLdString = serializeJsonLd(orgJsonLd);

	return (
		<html lang="en" style={{ '--accent-color': accentColor } as React.CSSProperties} suppressHydrationWarning>
			<body className="flex min-h-screen flex-col font-sans antialiased">
				<div id="print-widget-target" data-print-id="bf9e1e41-a5ed-4782-9e9e-bf0fee0fec7d"></div>
				<PlausibleTracker />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: orgJsonLdString }} />
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
					<VisualEditingLayout footerNavigation={footerNavigation} globals={globals} showHeader={false}>
						{children}
					</VisualEditingLayout>
				</ThemeProvider>
			</body>
		</html>
	);
}
