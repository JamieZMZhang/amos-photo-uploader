import { IconButton, TextField, Tooltip } from '@material-ui/core';
import { Refresh as RefreshIcon } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import * as React from 'react';
import { loadCategories } from '../../helpers/category';

export const CategoryDropdown = ({
	value = null,
	onChange = selected => void 0,
}) => {
	const [categoryReloadKey, reloadCategory] = React.useState();
	const [options, setOptions] = React.useState();
	React.useEffect(
		() => {
			loadCategories().then(setOptions);
		},
		[setOptions, categoryReloadKey]
	);

	return (
		<Autocomplete
			fullWidth
			getOptionLabel={getOptionLabel}
			value={value}
			renderInput={textFeildProps => (
				<TextField
					{...textFeildProps}
					required
					variant="outlined"
					label="分類"
					InputProps={{
						...textFeildProps.InputProps,
						startAdornment: (
							<Tooltip title="重新載入分類">
								<IconButton size="small" onClick={reloadCategory} children={<RefreshIcon />} />
							</Tooltip>
						)
					}}
				/>
			)}
			options={options ?? []}
			onChange={(evt, selected) => onChange(selected)}
		/>
	);
}

function getOptionLabel(opt) {
	return opt?.label ?? '';
}