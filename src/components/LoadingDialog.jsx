import { Dialog, DialogContent, Typography } from '@material-ui/core';
import * as React from 'react';
import { InlineCircularrProgress } from './InlineCircularProgress';

export const LoadingDialog = ({
	label = '載入中'
}) => {
	return (
		<Dialog open maxWidth="xs" fullWidth>
			<DialogContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<InlineCircularrProgress />
				<Typography variant="h6" component="span" children={label} style={{ marginLeft: '.5rem' }} />
			</DialogContent>
		</Dialog>
	);
};