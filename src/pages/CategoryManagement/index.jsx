import { Button, Container, Paper, Toolbar, Typography } from '@material-ui/core';
import { AddBox as AddIcon, Refresh as RefreshIcon } from '@material-ui/icons';
import * as React from 'react';
import { LoadingDialog } from '../../components/LoadingDialog';
import { TextEditDialog } from '../../components/TextEditDialog';
import { createCategory, loadCategories } from '../../helpers/category';
import { CategoryAccordion } from './CategoryAccordion';

export const CategoryManagement = () => {
	const [categories, setCategories] = React.useState([]);
	const [loadingCategories, setLoadingCategories] = React.useState(false);
	const [categoryReloadKey, reloadCategory] = React.useState({});
	React.useEffect(
		() => {
			setLoadingCategories(true);
			loadCategories().then(cat => {
				setCategories(cat);
			}).finally(() => {
				setLoadingCategories(false);
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
	return <Container maxWidth="lg" style={{ padding: '.5rem' }}>
		<Paper style={{ textAlign: 'center' }}>
			<Toolbar >
				<Button startIcon={<AddIcon />} children="新增分類" onClick={() => setEditTarget(null)} />
				<Button startIcon={<RefreshIcon />} children="重新載入" onClick={reloadCategory} />
			</Toolbar>
			{loadingCategories && <LoadingDialog label="分類載入中……" />}
			{!loadingCategories && categories.length === 0 && (
				<Typography variant="h5" component="span" children="您沒有任何分類" style={{ margin: '1rem' }} />
			)}
		</Paper>
		{categories.map(cat => (
			<CategoryAccordion
				key={cat.value}
				category={cat}
				expanded={expandCategory === cat.value}
				onExpand={(e) => setExpandCategory(expandCategory === cat.value ? null : cat.value)}
				onUpdate={() => reloadCategory({})}
			/>
		))}
		{editTarget !== undefined && (
			<TextEditDialog
				defaultValue={''}
				title="新增分類"
				onResult={onEditResult}
			/>
		)}
	</Container>
}