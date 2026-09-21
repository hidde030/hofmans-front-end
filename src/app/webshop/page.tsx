import { Metadata } from 'next';
import { fetchSiteData } from '@/lib/directus/fetchers';
import WebshopClient from './WebshopClient';

export const metadata: Metadata = {
	title: 'Webshop',
	description: 'Bestel eenvoudig drukwerk via de Hofmans Webshop.',
};

export default async function WebshopPage() {
	const { globals, headerNavigation } = await fetchSiteData();

	return (
		<WebshopClient headerNavigation={headerNavigation} globals={globals} />
	);
}