import { Button, Dialog, DialogActions, DialogContent, DialogTitle, OutlinedInput } from '@material-ui/core';
import * as React from 'react';

export const TextEditDialog = ({
	defaultValue = '',
	title = '編輯',
	onResult = (newValue) => void 0,
	size = 'sm',
	InputProps = null,
}) => {
	const [content, setContent] = React.useState(defaultValue);

	const onFormSubmit = e => {
		e.preventDefault();
		onResult(content);
	};

	return (
		<Dialog open onClose={() => onResult(null)} maxWidth={size} fullWidth>
			<form onSubmit={onFormSubmit}>
				<DialogTitle children={title} />
				<DialogContent>
					<OutlinedInput
						fullWidth
						value={content}
						onChange={evt => setContent(evt.target.value)}
						placeholder={defaultValue}
						{...InputProps}
					/>
				</DialogContent>
				<DialogActions>
					<Button children="取消" onClick={() => onResult(null)} />
					<Button children="儲存" type="submit" color="primary" />
				</DialogActions>
			</form>
		</Dialog>
	)
}