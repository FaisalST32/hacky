import { useEffect, useState } from 'react';

export const Type = ({ text, onLetter }: { text: string; onLetter: () => void }) => {
	const [content, setContent] = useState('');
	useEffect(() => {
		const interval = setInterval(() => {
			setContent((c) => {
				if (c.length === text.length) {
					clearInterval(interval);
					return text;
				}
				onLetter();
				return text.slice(0, c.length + 1);
			});
		}, 50);
	}, [text]);
	return <div>{content}</div>;
};
