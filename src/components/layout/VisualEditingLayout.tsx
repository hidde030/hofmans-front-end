'use client';

import { useRef, useEffect, ReactNode, Suspense } from 'react';
import { useVisualEditing } from '@/hooks/useVisualEditing';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/components/layout/NavigationBar';
import Footer from '@/components/layout/Footer';

interface VisualEditingLayoutProps {
	headerNavigation?: any;
	footerNavigation: any;
	globals: any;
	children: ReactNode;
	showHeader?: boolean;
}

function VisualEditingControls({
	navRef,
	footerRef,
	showHeader = true,
}: {
	navRef: React.RefObject<HTMLElement | null>;
	footerRef: React.RefObject<HTMLElement | null>;
	showHeader?: boolean;
}) {
	const { isVisualEditingEnabled, apply } = useVisualEditing();
	const router = useRouter();

	useEffect(() => {
		if (isVisualEditingEnabled) {
			// Apply visual editing for the navigation bar if its ref is set.
			if (navRef.current) {
				apply({
					elements: [navRef.current],
					onSaved: () => router.refresh(),
				});
			}
			// Apply visual editing for the footer if its ref is set.
			if (footerRef.current) {
				apply({
					elements: [footerRef.current],
					onSaved: () => router.refresh(),
				});
			}
		}
	}, [isVisualEditingEnabled, apply, router, navRef, footerRef]);

	return null;
}

export default function VisualEditingLayout({
	headerNavigation,
	footerNavigation,
	globals,
	children,
}: VisualEditingLayoutProps) {
	const navRef = useRef<HTMLElement>(null);
	const footerRef = useRef<HTMLElement>(null);

	return (
		<>
			{showHeader && headerNavigation && (
				<NavigationBar ref={navRef} navigation={headerNavigation} globals={globals} />
			)}
			{children}
			<Footer ref={footerRef} navigation={footerNavigation} globals={globals} />
			<Suspense fallback={null}>
				<VisualEditingControls navRef={navRef} footerRef={footerRef} />
			</Suspense>
		</>
	);
}
