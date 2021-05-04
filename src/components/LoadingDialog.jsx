import { Dialog, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import * as React from 'react';
import { InlineCircularrProgress } from './InlineCircularProgress';

export const LoadingDialog = ({
	title,
	message = '載入中'
}) => {
	return (
		<Dialog open maxWidth="xs" fullWidth>
			{!!title && <DialogTitle children={title} />}
			{
				typeof message === 'string' ? (
					<DialogContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<InlineCircularrProgress />
						<Typography variant="h6" component="span" children={message} style={{ marginLeft: '.5rem' }} />
					</DialogContent>
				) : (
					<DialogContent children={message} />
				)
			}
		</Dialog>
	);
};