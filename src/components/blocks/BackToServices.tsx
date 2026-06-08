import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackToServicesProps {
	data: any;
}

export default function BackToServices({ data }: BackToServicesProps) {
	return (
			<div className="container px-4 py-3">
				<div className="flex justify-start">
					<Button asChild variant="outline">
						<Link href="/diensten" className="flex items-center gap-2">
							<ArrowLeft className="size-5" />
							<span>Ga terug naar diensten</span>
						</Link>
					</Button>
				</div>
			</div>
	);
}
