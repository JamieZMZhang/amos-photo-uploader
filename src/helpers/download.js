export async function GET(url) {
	const payload = await fetch(url).then(res => res.text());
	const dom = document.createElement('html');
	dom.innerHTML = payload;

	return dom;
}