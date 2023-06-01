import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { FaHome, FaUser, FaUserCircle } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../services/features/auth/authSlice';
import { AppDispatch } from '../../services/store';

const Header = () => {
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();
	const logoutUser = () => {
		dispatch(logout());
		router.replace('/auth/login');
	};
	return (
		<div className=' w-full bg-slate-800 flex sm:hidden justify-between items-center p-2'>
			<div className='rounded-full w-16 h-16 border-slate-100 flex items-center justify-center cursor-pointer'>
				{router.route !== '/auth/profil' ? (
					<Link href='/auth/profil'>
						<div className='w-full h-full flex justify-center items-center'>
							<FaUser className='text-slate-500 text-3xl' />
						</div>
					</Link>
				) : (
					<Link href='/'>
						<div className='w-full h-full flex justify-center items-center'>
							<FaHome className='text-slate-500 text-3xl' />
						</div>
					</Link>
				)}
			</div>
			<div>
				<h2 className='text-slate-100 font-extrabold'>cryptoChat</h2>
			</div>
			<button
				className=' bottom-2 left-2 w-12 h-12 bg-slate-300 hover:bg-red-700 hover:text-white text-red-700 duration-700 animate-pulse rounded-xl text-red	-900 flex items-center justify-center'
				onClick={logoutUser}
			>
				<MdLogout />
			</button>
		</div>
	);
};

export default Header;
