'use client';

import RichText from '@/components/blocks/RichText';
import TextWithImage from '@/components/blocks/TextWithImage';
import Hero from '@/components/blocks/Hero';
import Gallery from '@/components/blocks/Gallery';
import Pricing from '@/components/blocks/Pricing';
import Posts from '@/components/blocks/Posts';
import Form from '@/components/blocks/Form';
import ButtonGroup from '@/components/blocks/ButtonGroup';
import RelatedServices from '@/components/blocks/RelatedServices';
import BlockAllServices from '@/components/blocks/BlockAllServices';
import BlockRelatedProjects from '@/components/blocks/BlockRelatedProjects';

interface BaseBlockProps {
	block: {
		collection: string;
		item: any;
		id: string;
	};
}

const BaseBlock = ({ block }: BaseBlockProps) => {
	const components: Record<string, React.ElementType> = {
		block_hero: Hero,
		block_richtext: RichText,
		block_gallery: Gallery,
		block_pricing: Pricing,
		block_posts: Posts,
		block_form: Form,
		block_text_image: TextWithImage,
		block_button_group: ButtonGroup,
		block_related_service: RelatedServices,
		block_all_services: BlockAllServices,
		block_related_projects: BlockRelatedProjects,
	};

	const Component = components[block.collection];

	if (!Component) {
		return null;
	}
	const itemId = block.item?.id;

	return <Component data={block.item} blockId={block.id} itemId={itemId} />;
};

export default BaseBlock;
