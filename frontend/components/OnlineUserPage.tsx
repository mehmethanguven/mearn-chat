import Link from 'next/link'
import OnlineUsersPage from '../pages/online-users'
import { OnlineUser } from '../types/online-user'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUsers } from '../services/features/users/usersSlice'
import { AppDispatch } from '../services/store'
import clsx from 'clsx'

type OnlineUserPageProps = {
  user: OnlineUser
  setStatus: (userId: string, isReady: boolean) => void
}

const OnlineUserPage = ({ user, setStatus }: OnlineUserPageProps) => {
  return (
    <div className='w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
      <div className='flex justify-end px-4 pt-4'>
        <button
          id='dropdownButton'
          data-dropdown-toggle='dropdown'
          className='inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5'
          type='button'
        >
          <span className='sr-only'>Open dropdown</span>
          <svg
            className='w-6 h-6'
            aria-hidden='true'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z'></path>
          </svg>
        </button>
        {/* <!-- Dropdown menu --> */}
        <div
          id='dropdown'
          className='z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700'
        >
          <ul className='py-2' aria-labelledby='dropdownButton'>
            <li>
              <a
                href='#'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
              >
                Edit
              </a>
            </li>
            <li>
              <a
                href='#'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
              >
                Export Data
              </a>
            </li>
            <li>
              <a
                href='#'
                className='block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
              >
                Delete
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className='flex flex-col items-center pb-10'>
        <img
          className='w-24 h-24 mb-3 rounded-full shadow-lg'
          src={user.imageUrl ?? '/images/avatar.png'}
          alt='user image'
        />
        <h5
          className={clsx(
            'mb-1 font-medium text-md dark:text-white',
            user.isReady ? 'text-blue-500' : 'text-red-500',
          )}
        >
          {user.isReady ? 'Ready' : 'Busy'}
        </h5>
        <h5 className='mb-1 text-xl font-medium text-gray-900 dark:text-white'>
          {user.username}
        </h5>
        <span className='text-sm text-gray-500 dark:text-gray-400'>
          {user.id}
        </span>
        <div className='flex mt-4 space-x-3 md:mt-6'>
          <Link href={'/text-chats'}>
            <a
              href='#'
              className='inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            >
              Text Chat
            </a>
          </Link>

          <Link href={'/video-chats'}>
            <a
              href='#'
              className='inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-red-600 border border-gray-300 rounded-lg focus:ring-4 focus:outline-none focus:ring-gray-200 hover:bg-gray-400 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700'
            >
              Video Chat
            </a>
          </Link>
          <button
            onClick={() => setStatus(user.id, !user.isReady)}
            className={clsx(
              'inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white border border-gray-300 rounded-lg hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700',
              user.isReady ? 'bg-blue-500' : 'bg-red-500',
            )}
          >
            Status
          </button>
        </div>
      </div>
    </div>
  )
}

export default OnlineUserPage
