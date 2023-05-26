import React, {
	FormEvent,
	KeyboardEvent,
	KeyboardEventHandler,
	useState,
} from 'react';
import { BiImageAdd } from 'react-icons/bi';
import { MdSend } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import {
	addMessage,
	getMessages,
	getUsersMessages,
} from '../services/features/messages/messageSlice';
import { AppDispatch } from '../services/store';

const ChatForm = () => {
	const [messageInput, setMessageInput] = useState('');
	const dispatch = useDispatch<AppDispatch>();
	const { contact } = useSelector((state: any) => state.contact);

	const handleChange = (e: any) => {
		setMessageInput(e.target.value);
	};
	const handleSend = async () => {
		const receiverID: string = contact._id;
		await dispatch(addMessage({ content: messageInput, receiverID }));
		setMessageInput('');
	};
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		handleSend();
		dispatch(getUsersMessages());
	};
	return (
		<div className='absolute bottom-0 left-0 right-0 bg-slate-600 text-slate-100 rounded-b-xl p-0 sm:p-2 min-h-max'>
			<form
				onSubmit={handleSubmit}
				className='flex justify-between items-center min-h-max h-16 sm:h-14'
			>
				{/* <span>icon</span> */}
				<div className='bg-slate-400 flex items-center w-full h-full mx-0    rounded-xl'>
					<textarea
						name=''
						id=''
						className='w-full h-full rounded-none sm:rounded-l-xl focus:outline-none bg-gray-600 sm:bg-slate-800 m-0 text-gray-300 px-2 box-border'
						value={messageInput}
						onChange={handleChange}
						onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
							if (e.code === 'Enter') handleSend();
						}}
					></textarea>
					<button
						type='submit'
						className='w-16 h-full sm:h-14  bg-slate-900 text-slate-200 flex justify-center items-center text-2xl rounded-none sm:rounded-r-xl hover:animate-pulse hover:shadow-xl'
					>
						<MdSend />
					</button>
				</div>
			</form>
		</div>
	);
};

export default React.memo(ChatForm);
