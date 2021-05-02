class LazyWrapper {
	constructor(fn) {
		if (typeof fn !== 'function') throw new Error('延遲載入的對象必需函數');
		this.fn = fn;
	}
}

function returnResult(result) {
	if (result instanceof LazyWrapper) return result.fn();
	return result;
}

export function lazy(fn) {
	return new LazyWrapper(fn);
}

export function iif(...args) {
	for (let i = 0; i <= args.length - 2; i += 2) {
		switch (true) {
			case typeof args[i] === 'function' && !!args[i]():
			case !!args[i]:
				return returnResult(args[i + 1]);
			default:
		}
	}
	if (args.length % 2 === 1) {
		return returnResult(args[args.length - 1]);
	}
}

