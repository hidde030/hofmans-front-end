'use client';

import Tagline from '@/components/ui/Tagline';
import Headline from '@/components/ui/Headline';
import PricingCard from '@/components/blocks/PricingCard';
import { setAttr } from '@directus/visual-editing';

interface PricingCardType {
	id: string;
	title: string;
	description?: string;
	price?: string;
	badge?: string;
	features?: string[];
	button?: {
		id: string;
		label: string | null;
		variant: string | null;
		url: string | null;
	};
	is_highlighted?: boolean;
}

interface PricingData {
	id: string;
	tagline?: string;
	headline?: string;
	pricing_cards: PricingCardType[];
}

interface PricingProps {
	data: PricingData;
}

const Pricing = ({ data }: PricingProps) => {
	const { id, tagline, headline, pricing_cards } = data;

	if (!pricing_cards || !Array.isArray(pricing_cards)) {
		return null;
	}

	return (
		<section className="px-8 md:px-0">
			{tagline && (
				<Tagline
					tagline={tagline}
					className="text-center md:text-left"
					data-directus={setAttr({
						collection: 'block_pricing',
						item: id,
						fields: 'tagline',
						mode: 'popover',
					})}
				/>
			)}
			{headline && (
				<Headline
					headline={headline}
					className="text-center md:text-left text-3xl md:text-4xl lg:text-5xl"
					data-directus={setAttr({
						collection: 'block_pricing',
						item: id,
						fields: 'headline',
						mode: 'popover',
					})}
				/>
			)}
			<div
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12"
				data-directus={setAttr({
					collection: 'block_pricing',
					item: id,
					fields: ['pricing_cards'],
					mode: 'modal',
				})}
			>
				{pricing_cards.map((card) => (
					<PricingCard key={card.id} card={card} />
				))}
			</div>
		</section>
	);
};

export default Pricing;
