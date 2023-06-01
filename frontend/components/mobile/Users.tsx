import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../services/features/auth/authSlice';
import { getContact } from '../../services/features/contact/contactSlice';
import { AppDispatch } from '../../services/store';
import User from '../skeleton/User';
import Header from './Header';

const AsideUsers = () => {
	const router = useRouter();

	const {
		users: usersMessages,
		isError: errMess,
		errorMessage: isLoadingMsg,
	} = useSelector((state: any) => state.messages);
	const dispatch = useDispatch<AppDispatch>();

	const showDiscussion = (id: string) => {
		dispatch(getContact(id));
		router.replace('/messages');
	};

	const { user: connectedUser } = useSelector((state: any) => state.auth);
	const { users, isLoading } = useSelector((state: any) => state.users);
	return (
		<div className='flex sm:hidden top-2 bottom-2  w-full bg-gray-900 rounded-none p-0 m-0  flex-col '>
			<Header />
			{/* main users */}
			<div className='users h-full min-w-max overflow-y-scroll'>
				{isLoadingMsg ? (
					<div className='flex flex-wrap flex-col justify-end items-end text-slate-100  w-full p-2'>
						<h2 className='text-2xl ml-2 font-extrabold text-blue-400 self-start sticky top-0 z-[100] bg-gray-900'>
							Messages
						</h2>
						<User />
						<User />
						<User />
					</div>
				) : (
					<>
						{usersMessages ? (
							<div className=''>
								<h2 className='text-2xl ml-2 font-extrabold text-blue-400 sticky top-0 z-[100] bg-gray-900'>
									Messages
								</h2>

								{usersMessages.map((user: any) => (
									<div key={user._id}>
										{user?._id.toString() != connectedUser?._id.toString() ? (
											<div
												key={user._id}
												className=' my-2 mr-2 p-2 rounded text-white flex flex-row items-center hover:bg-blue-800 duration-700 hover:animate-pulse min-w-max'
												onClick={() => showDiscussion(user._id)}
											>
												<div className='profile-img w-10 h-10 border-slate-50 mr-2 rounded-full cursor-pointer  text-gray-800 text-5xl flex items-center justify-center font-bold p-0'>
													{user && user.imageUrl != undefined ? (
														<div className='h-full w-full'>
															<img
																src={user.imageUrl}
																width={'100%'}
																height='100%'
																className='w-full h-full rounded-full'
															/>
														</div>
													) : (
														<FaUserCircle />
													)}
												</div>
												<div className='w-full'>
													<h3 className='text-md cursor-pointer'>
														<span>{user.name}</span>{' '}
														<span>{user.lastname}</span>
													</h3>
													<div className='text-xs text-slate-400 flex justify-between w-full'>
														<h5>{user.message?.substring(0, 5)} ...</h5>
														<h5>{new Date(user.date).toLocaleDateString()}</h5>
													</div>
												</div>
											</div>
										) : (
											<></>
										)}
									</div>
								))}
							</div>
						) : (
							<p>vous n'avez pas encore des conversations</p>
						)}
					</>
				)}
				{isLoading ? (
					<div className='flex flex-wrap flex-col justify-end items-end text-slate-100  w-full p-2'>
						<h2 className='text-2xl ml-2 font-extrabold text-blue-400 self-start sticky top-0 z-[100] bg-gray-900'>
							Contacts
						</h2>
						<User />
						<User />
						<User />
					</div>
				) : (
					<>
						{users ? (
							<div className=''>
								<h2 className='text-2xl ml-2 font-extrabold text-blue-400 sticky top-0 z-[100] bg-gray-900'>
									Contacts
								</h2>

								{users.map((user: any) => (
									<div key={user._id}>
										{user?._id.toString() != connectedUser?._id.toString() ? (
											<div
												key={user._id}
												className=' my-2 mr-2 p-2 rounded text-white flex flex-row items-center hover:bg-blue-800 duration-700 hover:animate-pulse min-w-max'
												onClick={() => showDiscussion(user._id)}
											>
												<div className='profile-img w-12 h-12 border-slate-50 mr-2 rounded-full cursor-pointer  text-slate-600  text-5xl flex items-center justify-center font-bold p-0'>
													{user && user.imageUrl != undefined ? (
														<div className='h-full w-full'>
															<img
																src={user.imageUrl}
																width={'100%'}
																height='100%'
																className='w-full h-full rounded-full'
															/>
														</div>
													) : (
														<div>
															<FaUserCircle className='w-12 h-12  ' />
														</div>
													)}
												</div>
												<div>
													<h3 className=' cursor-pointer'>
														<span>{user.name}</span>{' '}
														<span>{user.lastname}</span>
													</h3>
													<h5 className='text-sm text-slate-400'>
														@{user.username}
													</h5>
												</div>
											</div>
										) : (
											<></>
										)}
									</div>
								))}
							</div>
						) : (
							<p>Les autres memebres ne sont pas disponibles</p>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default AsideUsers;
