import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { UPLOAD_ACCEPT } from '@/lib/security/file-upload';

interface FileUploadFieldProps {
	name: string;
	form: UseFormReturn;
}

const FileUploadField = ({ name, form }: FileUploadFieldProps) => {
	return (
		<Input
			type="file"
			id={name}
			accept={UPLOAD_ACCEPT}
			onChange={(e) => {
				const file = e.target.files?.[0];
				form.setValue(name, file);
			}}
		/>
	);
};

export default FileUploadField;
