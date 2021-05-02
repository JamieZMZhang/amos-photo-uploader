import { CircularProgress } from '@material-ui/core'
import * as React from 'react';

export const InlineCircularrProgress = props => {
	return <CircularProgress  {...props} style={{ width: '1.5em', height: '1.5em', ...props.style }} />;
}