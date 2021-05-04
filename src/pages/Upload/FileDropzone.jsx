import { Button, ButtonBase, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Typography } from '@material-ui/core';
import * as React from 'react';
import { useDropzone } from 'react-dropzone';

export const FileDropzone = ({
	onAddFiles = files => void 0,
}) => {
	const [rejectedFiles, setRejectedFiles] = React.useState([]);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: '.jpg',
		multiple: true,
		onDropAccepted: onAddFiles,
		onDropRejected: files => setRejectedFiles(files.map(file => file.file.name)),
	});

	return (
		<>
			<ButtonBase
				{...getRootProps()}
				component={Paper}
				style={{
					width: '100%',
					height: 100,
					background: isDragActive ? 'rgba(0,0,0,0.1)' : undefined,
					position: 'relative',
				}}>
				<input {...getInputProps()} />
				<Typography
					variant="h6"
					component="span"
					children="點擊或是拖曳檔案上傳"
					style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
				/>
			</ButtonBase>
			{!!rejectedFiles?.length && (
				<Dialog open maxWidth="sm">
					<DialogTitle children="不支援檔案以下檔案" />
					<DialogContent>
						<DialogContentText children={rejectedFiles.join('\n')} style={{ whiteSpace: 'pre-wrap' }} />
					</DialogContent>
					<DialogActions>
						<Button children="關閉" onClick={() => setRejectedFiles(undefined)} />
					</DialogActions>
				</Dialog>
			)}
		</>
	)
};