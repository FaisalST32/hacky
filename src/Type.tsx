import { useEffect, useState } from 'react';

export const Type = ({ text }: { text: string }) => {
	const [content, setContent] = useState('');
	useEffect(() => {
		const interval = setInterval(() => {
			setContent((c) => {
				if (c.length === text.length) {
					clearInterval(interval);
					return text;
				}
				return text.slice(0, c.length + 1);
			});
		}, 100);
	}, [text]);
	return <div>{content}</div>;
};
