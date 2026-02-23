import React from 'react';
import { PageBlock } from '@/types/directus-schema';
import BaseBlock from '@/components/blocks/BaseBlock';
import Container from '@/components/ui/container';

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
				const isFullWidth = block.collection === 'block_hero' && (block.item as any).layout === 'image_cover';
				const Wrapper = isFullWidth ? React.Fragment : Container;

				return (
					<div key={block.id} data-background={block.background} className={isFullWidth ? '' : 'py-16'}>
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
