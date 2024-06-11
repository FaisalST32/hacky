import { useRef, useState } from 'react';
import './App.css';
import { Type } from './Type';

type Message = {
	id: string;
	content: string;
	role: 'Prompter' | 'Assistant';
};

const fetchResponse = async (message: string) => {
	const response = await fetch(
		'https://y4a9gfee3h.execute-api.us-east-1.amazonaws.com/jcteststage/querytest',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({ prompt: message }),
		}
	);
	return await response.text();
};


function App() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [prompt, setPrompt] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const chatRef = useRef<HTMLDivElement>(null);

	const sendMessage = async (message: string) => {
		const messageId = crypto.randomUUID();
		const promptMessage: Message = {
			id: messageId,
			content: message,
			role: 'Prompter',
		};
		setPrompt('');
		setMessages((prev) => [...prev, promptMessage]);
		setTimeout(() => {
			chatRef.current?.scrollTo({ top: chatRef.current?.scrollHeight, behavior: 'smooth' });
		}, 0);
		setIsLoading(true);
		const response = await fetchResponse(message);
		const assistantMessage: Message = {
			id: crypto.randomUUID(),
			content: response,
			role: 'Assistant',
		};
		setMessages((prev) => [...prev, assistantMessage]);
		setIsLoading(false);
		setTimeout(() => chatRef.current?.scrollTo({ top: chatRef.current?.scrollHeight, behavior: 'smooth' }), 100);
	};

	return (
		<div className='root'>
			<div className='header'>
				<img src='/barclays.png' alt='Barclays' />
				<h2 className=''>GenAIFE</h2>
			</div>
			<div className='chat' ref={chatRef} id='chat'>
				{messages.map((message) => {
					return (
						<div
							key={message.id}
							className={'message' + ' ' + message.role}
						>
							<small className='role'>{message.role}</small>
							<div className='content'>
								{ message.role === 'Assistant' ? (
									<Type text={message.content} onLetter={() => chatRef.current?.scrollTo({ top: chatRef.current?.scrollHeight, behavior: 'smooth' })} />
								) : (
									message.content
								)}
							</div>
						</div>
					);
				})}
				{isLoading && (
					<div className='loading'>Generating Response...</div>
				)}
			</div>
			{messages.length === 0 && (
				<div className='welcome'>
					<Type onLetter={() => {}} text='Welcome to GenAIFE, a gateway into Barclays infrastructure.' />
				</div>
			)}
			<div className='message-box'>
				<textarea
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					rows={4}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
							sendMessage(prompt);
						}
					}}
				></textarea>
				<button
					disabled={isLoading || prompt.length === 0}
					onClick={() => sendMessage(prompt)}
				>
					Send
				</button>
			</div>
		</div>
	);
}

export default App;
