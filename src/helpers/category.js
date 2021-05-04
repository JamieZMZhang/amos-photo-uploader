import { getTpl } from './tpl';
import { GET } from './download';

export async function loadCategories() {
	const dom = await GET('/store_back/show_group_list.php');
	return [...dom.querySelectorAll('tr:not([class]) > td:first-child > a')]
		.map(a => ({ label: a.textContent, value: /id=(\d+)/.exec(a.href)[1] }))
		.filter(v => v.value);
}

export async function loadSubCategories(categoryId) {
	const dom = await GET(`/store_back/show_group_ajax.php?act=show_data&id=${categoryId}&value=undefined`);
	return [...dom.querySelectorAll('option')]
		.map(opt => ({ label: opt.textContent, value: opt.value, parentId: categoryId }))
		.filter(v => v.value);
}

export async function createCategory({ title, parentId } = {}) {
	if (!title) throw new Error('[title]不可為空');

	const form = new FormData();
	form.append('name', title);
	if (parentId) {
		form.append('top_id', parentId);
		form.append('tpl', await getTpl(`/store_back/add_show_second_group.php?top_id=${parentId}`));
	} else {
		form.append('tpl', await getTpl(`/store_back/add_show_group.php`));
	}

	return fetch('/store_back/pro_edit.php', {
		method: 'post',
		body: form
	});
}

export async function updateCategory({ parentId, categoryId, newTitle } = {}) {
	const form = new FormData();
	form.append('name', newTitle);
	form.append('id', categoryId);
	if (parentId) {
		form.append('tpl', await getTpl(`/store_back/add_show_second_group.php?top_id=${parentId}`));
		form.append('top_id', parentId);
	} else {
		form.append('tpl', await getTpl(`/store_back/add_show_group.php`));
	}

	return fetch('/store_back/pro_edit.php', {
		method: 'post',
		body: form
	});
}

export async function deleteCategory({ categoryId, parentId } = {}) {
	const tplUrl = parentId
		? `/store_back/show_second_group_list.php?top_id=${parentId}`
		: `/store_back/show_group_list.php`;
	const dom = await GET(tplUrl);
	const value = dom.querySelector('a[onclick]').onclick;
	const tpl = /'\d+'\s*,\s*'(.+)'/.exec(value)[1];
	return fetch(`/store_back/pro_edit.php?tpl=${tpl}&id=${categoryId}`);
}

export async function updateCategoryOrder(categoryIdsInOrder) {
	if (!Array.isArray(categoryIdsInOrder)) return Promise.reject('[categoryIdsInOrder]參數不正確，需為id array');
	return Promise.all(categoryIdsInOrder.map((id, index) => {
		return new Promise(async (resolve, reject) => {
			setTimeout(() => {
				fetch(`/store_back/show_group_list.php?id=${id}&num=${index + 1}&page=`)
					.then(resolve)
					.catch(reject);
			}, 100 * index);
		});
	}));
}

