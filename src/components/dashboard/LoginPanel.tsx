'use client';

import { useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DirectusImage from '../shared/DirectusImage';

export default function LoginPanel() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await fetch('/api/dashboard/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});

			const payload = await response.json();

			if (!response.ok) {
				throw new Error(payload?.error || 'Inloggen mislukt.');
			}

			router.refresh();
			window.location.reload();
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : 'Inloggen mislukt.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(46,134,222,0.18),_transparent_38%),linear-gradient(180deg,#f7fafc_0%,#eef4f8_100%)] px-4 py-10 text-slate-900">
			<div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
				<div className="grid w-full gap-0 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.12)] lg:grid-cols-[1.1fr_0.9fr]">
					<div className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:block">
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.35),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.22),transparent_35%)]" />
						<div className="relative flex h-full flex-col justify-between">
							<div>
								<div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/80">
									<ShieldCheck className="size-4" />
									Hofmans dashboard
								</div>
								<h1 className="mt-3 text-4xl font-semibold tracking-tight">Welkom terug!</h1>
								<p className="mt-3 text-lg leading-6 text-slate-400">
									Log in met je Directus-account om de inzendingen van het formulier te bekijken.
								</p>
							</div>
						</div>
					</div>

					<div className="p-8 sm:p-10">
						<div className="mb-8">
							<p className="text-sm font-medium uppercase text-slate-500">Dashboard inloggen</p>
							<h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Directus-account vereist</h2>
							<p className="mt-3 text-sm leading-6 text-slate-600">
								Gebruik hetzelfde e-mailadres en wachtwoord als in Directus.
							</p>
						</div>

						<form className="space-y-5" onSubmit={handleSubmit}>
							<div className="space-y-2">
								<label className="text-sm font-medium text-slate-700" htmlFor="email">
									E-mailadres
								</label>
								<Input
									id="email"
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									autoComplete="email"
									required
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-slate-700" htmlFor="password">
									Wachtwoord
								</label>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									autoComplete="current-password"
									required
								/>
							</div>

							{error && (
								<div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
									{error}
								</div>
							)}

							<Button type="submit" className="w-full" disabled={loading}>
								{loading ? <Loader2 className="size-4 animate-spin" /> : null}
								{loading ? 'Bezig met inloggen' : 'Inloggen op dashboard'}
							</Button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
