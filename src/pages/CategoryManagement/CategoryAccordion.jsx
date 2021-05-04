import { AddBox as AddIcon, Refresh as RefreshIcon, Delete as DeleteIcon } from '@material-ui/icons';
import { Accordion, AccordionDetails, AccordionSummary, Button, IconButton, List, ListItem, ListItemText, Toolbar, Typography } from '@material-ui/core';
import { Edit as EditIcon } from '@material-ui/icons';
import * as React from 'react';
import { LoadingDialog } from '../../components/LoadingDialog';
import { createCategory, deleteCategory, loadSubCategories, updateCategory } from '../../helpers/category';
import { TextEditDialog } from './../../components/TextEditDialog';
import { iif } from '../../utilities/iif';
import { ConfirmDialog } from '../../components/ConfirmDialog';

const plus = n => n + 1;
const minus = n => n - 1;

export const CategoryAccordion = ({
	category = null,
	expanded = false,
	onExpand = () => void 0,
	onUpdate = () => void 0,
	readonly = false,
}) => {
	const [loadingCount, setLoadingCount] = React.useState(0);

	const [subcategories, setSubcategories] = React.useState([]);
	const [subcategoriesReloadKey, reloadsubcategory] = React.useState({});
	React.useEffect(
		() => {
			if (expanded) {
				setLoadingCount(minus);
				loadSubCategories(category.value).then(subcats => {
					setSubcategories(subcats);
				}).finally(() => {
					setLoadingCount(plus);
				});
			}
		},
		[expanded, setSubcategories, category.value, subcategoriesReloadKey]
	)

	const [editTarget, setEditTarget] = React.useState();
	const onEditCategory = (evt, category) => {
		evt.stopPropagation();
		setEditTarget(category);
	};
	const onEditResult = async result => {
		if (result) {
			setLoadingCount(plus);
			try {
				if (editTarget) {
					await updateCategory({
						parentId: editTarget.parentId,
						categoryId: editTarget.value,
						newTitle: result,
					});
					if (editTarget.parentId) {
						reloadsubcategory({});
					} else {
						onUpdate();
					}
				} else {
					await createCategory({
						parentId: category.value,
						title: result,
					});
					reloadsubcategory({});
				}
			} finally {
				setLoadingCount(minus);
			}
		}
		setEditTarget(undefined);
	};

	const [deleteTarget, setDeleteTarget] = React.useState();
	const onDeleteClick = (evt, category) => {
		evt.stopPropagation();
		setDeleteTarget(category);
	};
	const onConfirmDelete = async confirm => {
		if (confirm) {
			setLoadingCount(plus);
			await deleteCategory({
				categoryId: deleteTarget.value,
				parentId: deleteTarget.parentId,
			}).finally(() => {
				setLoadingCount(minus);
			});
			if (deleteTarget.parentId) {
				reloadsubcategory({});
			} else {
				onUpdate();
			}

		}
		setDeleteTarget(undefined);
	};
	if (!category) return null;
	return (
		<Accordion expanded={expanded} onChange={onExpand}>
			<AccordionSummary>
				<IconButton disabled={readonly} size="small" children={<EditIcon />} onClick={evt => onEditCategory(evt, category)} />
				<IconButton disabled={readonly} size="small" children={<DeleteIcon />} style={{ marginRight: '.5rem' }} onClick={evt => onDeleteClick(evt, category)} />
				<Typography variant="h6" component="span" children={category.label} />
			</AccordionSummary>
			<AccordionDetails style={{ flexDirection: 'column' }}>
				<Toolbar>
					<Button startIcon={<AddIcon />} children="新增子分類" onClick={() => setEditTarget(null)} />
					<Button startIcon={<RefreshIcon />} children="重新載入" onClick={() => reloadsubcategory({})} />
				</Toolbar>
				<List style={{ width: '100%', margin: '0 1rem' }}>
					{
						subcategories.map(sub => (
							<ListItem key={sub.value}>
								<IconButton size="small" children={<EditIcon />} style={{ marginRight: '.5rem' }} onClick={evt => onEditCategory(evt, sub)} />
								<IconButton size="small" children={<DeleteIcon />} style={{ marginRight: '.5rem' }} onClick={evt => onDeleteClick(evt, sub)} />
								<ListItemText primary={sub.label} />
							</ListItem>
						))
					}

					{subcategories.length === 0 && !loadingCount && (
						<ListItem children="沒有子分類" style={{ justifyContent: 'center' }} />
					)}
				</List>
			</AccordionDetails>
			{
				editTarget !== undefined && (
					<TextEditDialog
						defaultValue={editTarget?.label}
						title={iif(
							editTarget === null, '新增子分類',
							editTarget?.parentId, '編輯子分類',
							'編輯分類'
						)}
						onResult={onEditResult}
					/>
				)
			}
			{
				deleteTarget !== undefined && (
					<ConfirmDialog
						title="刪除確認"
						message={`請確認刪除：${deleteTarget?.label}`}
						onResult={onConfirmDelete}
					/>
				)
			}
			{ !!loadingCount && <LoadingDialog />}
		</Accordion >
	)
};