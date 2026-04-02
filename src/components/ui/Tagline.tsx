import { cn } from '@/lib/utils';

interface TitleProps {
	tagline?: string | null;
	className?: string;
	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
	'data-directus'?: string;
}

const Tagline = ({ tagline, className = '', as: Component = 'h2', 'data-directus': dataDirectus }: TitleProps) => {
	if (!tagline) return null;

	return (
		<Component
			className={cn('font-heading text-accent font-normal uppercase text-lg md:text-xl lg:text-tagline', className)}
			data-directus={dataDirectus}
		>
			{tagline}
		</Component>
	);
};

export default Tagline;
