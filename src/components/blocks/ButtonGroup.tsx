import Button, { ButtonProps } from '@/components/blocks/Button';
import { cn } from '@/lib/utils';

export interface ButtonGroupProps {
	buttons: ButtonProps[];
	className?: string;
}

const ButtonGroup = ({ buttons, className }: ButtonGroupProps) => {
	return (
		<div className={cn('flex flex-col sm:flex-row flex-wrap gap-4', className)}>
			{buttons?.map((button) => (
				<Button key={button.id} {...button} className={cn(button.className, 'w-full sm:w-auto')} />
			))}
		</div>
	);
};

export default ButtonGroup;
