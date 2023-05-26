import React from 'react';

const Message = () => {
	return (
		<div className='flex flex-wrap flex-col justify-end items-end text-slate-100 h-full w-full p-2 pb-20'>
			<div className='bg-gray-700 px-4 py-4 rounded-lg self-start  w-1/2 animate-pulse m-2'>
				<div className='w-full flex justify-between mb-2'>
					<h4 className='h-2 w-1/4 bg-gray-900 rounded'></h4>
					<h4 className='h-2 w-1/4 bg-gray-900 rounded'></h4>
				</div>
				<div className='h-8 w-full bg-gray-800 rounded'></div>
			</div>
			<div className='bg-gray-700 px-4 py-4 rounded-lg self-start  w-1/3 animate-pulse m-2'>
				<div className='w-full flex justify-between mb-2'>
					<h4 className='h-2 w-1/4 bg-gray-900 rounded'></h4>
					<h4 className='h-2 w-1/4 bg-gray-900 rounded'></h4>
				</div>
				<div className='h-8 w-full bg-gray-800 rounded'></div>
			</div>
			<div className='bg-gray-700 px-4 py-4 rounded-lg self-end  w-1/3 animate-pulse m-2'>
				<div className='w-full flex justify-between mb-2'>
					<h4 className='h-2 w-1/4 bg-gray-900 rounded'></h4>
					<h4 className='h-2 w-1/4 bg-gray-900 rounded'></h4>
				</div>
				<div className='h-8 w-full bg-gray-800 rounded'></div>
			</div>
			<div className='bg-gray-700 p-4 rounded-lg w-1/4 animate-pulse self-end m-2'>
				<div className='w-full flex justify-between mb-2'>
					<h4 className='h-2 w-1/4 bg-gray-900 rounded'></h4>
					<h4 className='h-2 w-1/4 bg-gray-900 rounded'></h4>
				</div>
				<div className='h-8 w-full bg-gray-800 rounded'></div>
			</div>
		</div>
	);
};

export default Message;
