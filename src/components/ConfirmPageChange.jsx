import * as React from 'react';
import { Prompt } from 'react-router';

export const ConfirmPageChange = ({
	when = false,
	message = "離開頁面會清空輸入的資料，你確定要離開嗎？"
}) => {
	const confirmRef = React.useRef();
	confirmRef.current = when && message;

	React.useEffect(
		() => {
			const handler = (e) => {
				if (confirmRef.current) {
					e.returnValue = confirmRef.current;
					return confirmRef.current;
				}
			};
			window.addEventListener('beforeunload', handler);
			return () => {
				window.removeEventListener('beforeunload', handler);
			};
		},
		[]
	);
	return <Prompt when={when} message={message} />;
};