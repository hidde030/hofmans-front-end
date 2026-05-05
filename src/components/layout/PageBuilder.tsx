import React from 'react';
import { PageBlock } from '@/types/directus-schema';
import BaseBlock from '@/components/blocks/BaseBlock';
import Container from '@/components/ui/container';
import { cn } from '@/lib/utils';
import { setAttr } from '@directus/visual-editing';

interface PageBuilderProps {
	sections: PageBlock[];
}

const PageBuilder = ({ sections }: PageBuilderProps) => {
	const validBlocks = sections.filter(
		(block): block is PageBlock & { collection: string; item: object } =>
			typeof block.collection === 'string' && !!block.item && typeof block.item === 'object',
	);

	return (
		<div>
			{validBlocks.map((block) => {
				const isHero = block.collection === 'block_hero';
				const isFullWidth = isHero && (block.item as any).layout === 'image_cover';
				const Wrapper = isFullWidth ? React.Fragment : Container;

				const borderPosition = (block.item as any).border;

				return (
					<div
						key={block.id}
						data-background={block.background}
						className={cn(
							isFullWidth ? undefined : 'py-16',
							borderPosition === 'top' && 'border-t-2 border-black',
							borderPosition === 'bottom' && 'border-b-2 border-black',
							borderPosition === 'both' && 'border-t-2 border-b-2 border-black',
						)}
						{...(block.collection === 'block_text_image' && {
							'data-directus': setAttr({
								collection: 'block_text_image',
								item: (block.item as any).id,
								fields: 'border',
								mode: 'popover',
							}),
						})}
					>
						<Wrapper>
							<BaseBlock
								block={{
									collection: block.collection,
									item: block.item,
									id: block.id,
								}}
							/>
						</Wrapper>
					</div>
				);
			})}
		</div>
	);
};

export default PageBuilder;
