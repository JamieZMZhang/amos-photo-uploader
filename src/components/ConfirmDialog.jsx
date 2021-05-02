import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import * as React from 'react';

export const ConfirmDialog = ({
	title = '確認',
	message = '你確定嗎？',
	onResult = result => void 0,
}) => {
	return (
		<Dialog open maxWidth="sm" fullWidth>
			<DialogTitle children={title} />
			<DialogContent>
				{
					typeof message === 'string'
						? <DialogContentText children={message} />
						: message
				}
			</DialogContent>
			<DialogActions>
				<Button children="否" onClick={() => onResult(false)} />
				<Button children="是" color="primary" onClick={() => onResult(true)} />
			</DialogActions>
		</Dialog>
	);
};
