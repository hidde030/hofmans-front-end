'use client';

import { useEffect } from 'react';

export default function PlausibleTracker() {
	useEffect(() => {
		async function initPlausible() {
			const { init } = await import('@plausible-analytics/tracker');
			init({
				domain: 'deallesdrukker.nl',
			});
		}
		initPlausible();
	}, []);

	return null;
}
