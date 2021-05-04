import { IconButton, TextField, Tooltip } from '@material-ui/core';
import { Refresh as RefreshIcon } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import * as React from 'react';
import { loadSubCategories } from '../../helpers/category';

export const SubcategoryDropdown = ({
	value = null,
	onChange = selected => void 0,
	parentId,
}) => {
	const [subcategoryReloadKey, reloadSubcategory] = React.useState();
	const [options, setOptions] = React.useState();
	React.useEffect(
		() => {
			loadSubCategories(parentId).then(setOptions);
		},
		[setOptions, subcategoryReloadKey, parentId]
	);

	return (
		<Autocomplete
			fullWidth
			getOptionLabel={getOptionLabel}
			value={value}
			renderInput={textFeildProps => (
				<TextField
					{...textFeildProps}
					variant="outlined"
					label="子分類"
					InputProps={{
						...textFeildProps.InputProps,
						startAdornment: (
							<Tooltip title="重新載入子分類">
								<IconButton size="small" onClick={reloadSubcategory} children={<RefreshIcon />} />
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