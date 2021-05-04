import { Button, Dialog, DialogActions, DialogContent, IconButton, TextField } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import React from 'react';

export const PhotoRow = ({
	photo,
	onDelete = photo => void 0,
	onTextChange = (photo, newText) => void 0,
}) => {
	const [text, setText] = React.useState(photo.text);

	const onChange = React.useCallback(
		evt => {
			setText(evt.target.value);
			onTextChange(photo, evt.target.value);
		},
		[onTextChange, setText, photo]
	);

	const [show, setShow] = React.useState(false);

	return (
		<div style={{ display: 'flex', alignItems: 'center', padding: '.5rem' }}>
			<IconButton size="small" children={<DeleteIcon />} onClick={() => onDelete(photo)} tabIndex={-1} />
			<div style={{ width: 160, Height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 .5rem' }}>
				<img
					className="drag-handle"
					src={photo.objectUrl}
					alt={photo.file.name}
					style={{ maxWidth: 160, maxHeight: 100, cursor: 'pointer' }}
					onClick={() => setShow(true)}
				/>
			</div>
			<div style={{ flexGrow: 1 }}>
				<TextField
					fullWidth
					multiline
					rows={3}
					variant="outlined"
					label={photo.file.name}
					placeholder="圖片說明(100字以內)"
					value={text}
					onChange={onChange}
					inputProps={{ maxLength: 100 }}
				/>
			</div>
			{show && (
				<Dialog open maxWidth="xl" onClose={() => setShow(false)}>
					<DialogContent>
						<img
							src={photo.objectUrl}
							alt={photo.file.name}
							style={{
								maxWidth: '100%',
								maxHeight: '100%',
							}}
						/>
					</DialogContent>
					<DialogActions>
						<Button children="關閉" onClick={() => setShow(false)} />
					</DialogActions>
				</Dialog>
			)}
		</div>
	)
};