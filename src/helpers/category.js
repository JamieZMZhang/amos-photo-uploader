import axios from 'axios';

export async function loadCategories() {
    const { data } = await axios.get('/store_back/show_add.php');
    const dom = document.createElement('html');
    dom.innerHTML = data;
    return [...dom.querySelectorAll('select[name=show_id] option')].map(opt => ({ label: opt.textContent, value: opt.value })).filter(v => v.value);
}

export async function loadSubCategories(category) {
    const { data } = await axios.get(`/store_back/show_group_ajax.php?act=show_data&id=${category}&value=undefined`);
    const dom = document.createElement('html');
    dom.innerHTML = data;
    return [...dom.querySelectorAll('option')].map(opt => ({ label: opt.textContent, value: opt.value })).filter(v => v.value);
}