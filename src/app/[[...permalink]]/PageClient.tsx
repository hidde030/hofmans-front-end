'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import PageBuilder from '@/components/layout/PageBuilder';
import NavigationBar from '@/components/layout/NavigationBar';
import { useVisualEditing } from '@/hooks/useVisualEditing';
import { PageBlock } from '@/types/directus-schema';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { setAttr } from '@directus/visual-editing';

interface PageClientProps {
	sections: PageBlock[];
	pageId?: string;
	customNavigation?: any;
	headerNavigation: any;
	globals: any;
	headerBackgroundColor?: string | null;
	headerLogo?: any;
	hideHomeLink?: boolean;
}

interface VisualEditingOptions {
	customClass?: string;
	onSaved?: () => void;
	elements?: HTMLElement[];
}

export default function PageClient({
	sections,
	pageId,
	customNavigation,
	headerNavigation,
	globals,
	headerBackgroundColor,
	headerLogo,
	hideHomeLink,
}: PageClientProps) {
	const navRef = useRef<HTMLElement>(null);
	const { isVisualEditingEnabled, apply } = useVisualEditing();
	const router = useRouter();

	useEffect(() => {
		if (isVisualEditingEnabled) {
			apply({
				onSaved: () => {
					router.refresh();
				},
			} as VisualEditingOptions);

			if (navRef.current) {
				apply({
					elements: [navRef.current],
					onSaved: () => {
						router.refresh();
					},
				} as VisualEditingOptions);
			}

			apply({
				elements: [document.querySelector('#visual-editing-button') as HTMLElement],
				customClass: 'visual-editing-button-class',
				onSaved: () => {
					router.refresh();
				},
			} as VisualEditingOptions);
		}
	}, [isVisualEditingEnabled, apply, router]);

	const navigationToUse = customNavigation || headerNavigation;

	return (
		<div className="relative flex flex-col min-h-screen">
			<NavigationBar
				ref={navRef}
				navigation={navigationToUse}
				globals={globals}
				customBackgroundColor={headerBackgroundColor}
				customLogo={headerLogo}
				hideHomeLink={hideHomeLink}
				pageId={pageId}
			/>
			<main className="flex-grow">
				<PageBuilder sections={sections} />
			</main>
			{isVisualEditingEnabled && pageId && (
				<div className="fixed z-50 w-full bottom-4 inset-x-0 p-4 flex justify-center items-center gap-2">
					{/* If you're not using the visual editor it's safe to remove this element. Just a helper to let editors add edit / add new blocks to a page. */}
					<Button
						id="visual-editing-button"
						variant="secondary"
						className="visual-editing-button-class"
						data-directus={setAttr({
							collection: 'pages',
							item: pageId,
							fields: ['blocks', 'meta_m2a_button'],
							mode: 'modal',
						})}
					>
						<Pencil className="size-4 mr-2" />
						Edit All Blocks
					</Button>
				</div>
			)}
			<style jsx global>{`
				/* Safe to remove this if you're not using the visual editor. */
				.directus-visual-editing-overlay.visual-editing-button-class .directus-visual-editing-edit-button {
					position: absolute;
					inset: 0;
					width: 100%;
					height: 100%;
					transform: none;
					background: transparent;
				}
			`}</style>
		</div>
	);
}
