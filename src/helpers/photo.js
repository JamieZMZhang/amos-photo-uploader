import { GET } from './download';
import { getTpl } from './tpl';

export async function uploadPhotos({
	categoryId,
	subCategoryId = '',
	photos = [],
	onProgress = percentage => void 0,
} = {}) {

	for (let i = 0; i < photos.length; i += 8) {
		onProgress(Math.floor(i / photos.length * 100));

		const form = new FormData();
		form.append('tpl', await getTpl('/store_back/show_add.php'));
		form.append('useno', 'amosphoto');
		form.append('show_id', categoryId);
		form.append('show_second_id', subCategoryId);
		form.append('button', '送出');
		for (let j = 0; j < 8; j += 1) {
			form.append(`pic[${j + 1}]`, photos[i + j]?.file ?? '');
			form.append(`content[${j + 1}]`, photos[i + j]?.text ?? '');
		}

		await fetch('/store_back/pro_edit.php', {
			method: 'post',
			body: form
		});
	}
}

export async function loadPhotos({
	categoryId = '',
	subCategoryId = '',
	page = 1
} = {}) {
	const dom = await GET(`/store_back/show_list.php?page=${page}&show_id=${categoryId}&show_second_id=${subCategoryId}`);
	return [...dom.querySelectorAll('tr:not([class])')].map(tr => {
		const cells = [...tr.children];


		return {
			id: /\(\s*'(\d+)'\s*,'/.exec(tr.querySelector('a[onclick]').onclick)[1],
			category: cells[0].textContent,
			subcategory: cells[1].textContent,
			link: cells[2].querySelector('img').src,
		};
	});
}

export async function deletePhotos({
	photoIds = [],
	onProgress = percentage => void 0,
} = {}) {
	for (let i = 0; i < photoIds.length; i += 1) {
		onProgress(Math.floor(i / photoIds.length * 100));
		await fetch(`/store_back/pro_edit.php?tpl=del_show&id=${photoIds[i]}&page=`).then(res => res.text());
	}
}

export async function updatePhotos({
	desciption,
	photoIds = [],
	categoryId,
	subcategoryId,
	onProgress = percentage => void 0,
} = {}) {
	for (let i = 0; i < photoIds.length; i += 1) {
		onProgress(Math.floor(i / photoIds.length * 100));
		const dom = await GET(`/store_back/show_edit.php?id=${photoIds[i]}&page=&show_id=&show_second_id=`);
		const tpl = dom.querySelector('input[name=tpl]').value;
		const oldCategoryId = document.querySelector('select[name=show_id]>[selected]').value;
		const oldSubCategoryId = document.querySelector('select[name=show_second_id]>[selected]').value;
		const oldDescription = document.querySelector('textarea[name=content]').value;

		const form = new FormData();
		form.append('tpl', tpl);
		form.append('id', photoIds[i]);
		form.append('show_id', categoryId ?? oldCategoryId);
		form.append('show_second_id', categoryId ? subcategoryId : oldSubCategoryId);
		form.append('content', desciption ?? oldDescription);
		await fetch(`/store_back/pro_edit.php?page=&show_id=&show_second_id=`, {
			method: 'post',
			body: form,
		}).then(res => res.text());
	}
}