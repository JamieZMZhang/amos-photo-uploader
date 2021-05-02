import { GET } from './download';

export async function getTpl(url, tplInputXpath = 'input[name=tpl]') {
	const dom = await GET(url);
	return dom.querySelector(tplInputXpath).value;
}