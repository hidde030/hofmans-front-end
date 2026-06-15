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

	let blockIndex = 0;

	return (
		<div>
			{validBlocks.map((block) => {
				const isHero = block.collection === 'block_hero';
				const isBackButton = block.collection === 'block_back_to_services';
				const isFullWidth = isHero && (block.item as any).layout === 'image_cover';
				const Wrapper = isFullWidth ? React.Fragment : Container;

				const borderPosition = block.collection === 'block_text_image' ? (block.item as any).border : undefined;

				const background = block.background;
				const bgClass =
					background === 'dark'
						? 'bg-background-variant text-white'
						: background === 'light'
							? 'bg-background text-foreground'
							: blockIndex % 2 === 0
								? 'bg-background text-foreground'
								: 'bg-gray text-foreground';

				if (!isHero && !isBackButton) blockIndex++;

				const isFirstBlock = !isHero && !isBackButton && blockIndex === 1;

				return (
					<div
						key={block.id}
						data-background={background}
						className={cn(
							bgClass,
							!isFullWidth && !isBackButton && 'py-12 lg:py-20',
							isFirstBlock && 'pt-8 lg:pt-12',
							borderPosition === 'top' && 'border-t-2 border-black',
							borderPosition === 'bottom' && 'border-b-2 border-black',
							borderPosition === 'both' && 'border-b-2 border-t-2 border-black',
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
