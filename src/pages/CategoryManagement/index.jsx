import { AppBar, Button, Container, makeStyles, Paper, Toolbar, Typography } from '@material-ui/core';
import { AddBox as AddIcon, Refresh as RefreshIcon } from '@material-ui/icons';
import * as React from 'react';
import { ReactSortable } from 'react-sortablejs';
import { ConfirmPageChange } from '../../components/ConfirmPageChange';
import { LoadingDialog } from '../../components/LoadingDialog';
import { TextEditDialog } from '../../components/TextEditDialog';
import { createCategory, loadCategories, updateCategoryOrder } from '../../helpers/category';
import { CategoryAccordion } from './CategoryAccordion';

const useStyles = makeStyles({
	draggingItem: {
		opacity: 1,
	},
	dropPreview: {
		opacity: .3
	}
});

export const CategoryManagement = () => {
	const classes = useStyles();

	const [loadingMessage, setLoadingMessage] = React.useState(null);

	const [categories, setCategories] = React.useState([]);
	const [categoryReloadKey, reloadCategory] = React.useState({});
	React.useEffect(
		() => {
			setLoadingMessage('分類載入中');
			loadCategories().then(cat => {
				setCategories(cat);
			}).finally(() => {
				setLoadingMessage(null);
			});
		},
		[setCategories, categoryReloadKey]
	);

	const [expandCategory, setExpandCategory] = React.useState(null);

	const [editTarget, setEditTarget] = React.useState();
	const onEditResult = async result => {
		if (result) {
			await createCategory({ title: result });
			reloadCategory({});
		}
		setEditTarget(undefined);
	};

	const [hasOrderChanged, setHasOrderChanged] = React.useState(false);
	const onOrderChange = newOrder => {
		for (let i = 0; i < newOrder.length; i += 1) {
			if (newOrder[i].value !== categories[i].value) {
				setCategories(newOrder);
				setHasOrderChanged(true);
				return;
			}
		}
	};
	const onSaveNewOrder = async () => {
		const ids = categories.map(cat => cat.value);
		setLoadingMessage('正在更新分類排序……');
		await updateCategoryOrder(ids).finally(() => {
			setLoadingMessage(null);
		});
		setHasOrderChanged(false);
		reloadCategory({});
	};
	const onCancelNewOrder = () => {
		setHasOrderChanged(false);
		reloadCategory({});
	};
	return (
		<Container maxWidth="lg" style={{ padding: '.5rem' }}>
			<ConfirmPageChange when={hasOrderChanged} />
			<Paper style={{ textAlign: 'center' }}>
				<AppBar position="static" color="default">
					<Toolbar>
						{!hasOrderChanged ? (
							<>
								<Button startIcon={<AddIcon />} children="新增分類" onClick={() => setEditTarget(null)} />
								<Button startIcon={<RefreshIcon />} children="重新載入" onClick={reloadCategory} />
							</>
						) : (
							<div style={{ flexGrow: 1, textAlign: 'right' }}>
								<Button children="更新排序" color="primary" onClick={onSaveNewOrder} />
								<Button children="取消排序" onClick={onCancelNewOrder} />
							</div>
						)}
					</Toolbar>
				</AppBar>
				{!loadingMessage && categories.length === 0 && (
					<Typography variant="h5" component="span" children="您沒有任何分類" style={{ margin: '1rem' }} />
				)}
			</Paper>
			<ReactSortable
				forceFallback
				list={categories}
				setList={onOrderChange}
				dragClass={classes.draggingItem}
				ghostClass={classes.dropPreview}
			>
				{categories.map(cat => (
					<CategoryAccordion
						key={cat.value}
						category={cat}
						readonly={hasOrderChanged}
						expanded={expandCategory === cat.value}
						onExpand={(e) => setExpandCategory(expandCategory === cat.value ? null : cat.value)}
						onUpdate={() => reloadCategory({})}
					/>
				))}
			</ReactSortable>
			{editTarget !== undefined && (
				<TextEditDialog
					defaultValue={''}
					title="新增分類"
					onResult={onEditResult}
				/>
			)}
			{!!loadingMessage && <LoadingDialog message={loadingMessage} />}
		</Container>
	);
}