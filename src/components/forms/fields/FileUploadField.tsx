import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ALLOWED_UPLOAD_EXTENSIONS } from '@/lib/formSecurity';

interface FileUploadFieldProps {
	name: string;
	form: UseFormReturn;
}

const FileUploadField = ({ name, form }: FileUploadFieldProps) => {
	return (
		<Input
			type="file"
			id={name}
			accept={ALLOWED_UPLOAD_EXTENSIONS.map((extension) => `.${extension}`).join(',')}
			onChange={(e) => {
				const file = e.target.files?.[0];
				form.setValue(name, file);
			}}
		/>
	);
};

export default FileUploadField;
