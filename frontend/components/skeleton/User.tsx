import React from 'react';

const User = () => {
	return (
		<div className='bg-gray-800 p-2 rounded-lg  w-44 box-border animate-pulse my-2 flex gap-2 self-center'>
			<div className='w-12 h-10 bg-gray-900 rounded-full'></div>
			<div className='w-full'>
				<div className=' w-full h-4 bg-gray-900 my-1 rounded-sm'></div>
				<div className=' w-3/4 h-3 bg-gray-900'></div>
			</div>
		</div>
	);
};

export default User;
