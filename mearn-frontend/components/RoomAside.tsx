import React, { useEffect, useState } from 'react'
import { logout } from '../services/features/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../services/store'
import { useRouter } from 'next/router'
import { MdLogout } from 'react-icons/md'
import { CiUser } from 'react-icons/ci'
import Link from 'next/link'
import AsideUsers from './mobile/Users'

const RoomAside = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: any) => state.auth)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      setCurrentUser(user)
    }

    return () => {}
  }, [])

  const logoutUser = () => {
    dispatch(logout())
    router.replace('/auth/login')
  }
  return (
    <aside className='relative flex-col justify-between hidden w-20 p-2 text-white bg-gray-900 md:flex'>
      <div className='cursor-pointer'>
        <Link href='/auth/profil'>
          <div className='flex items-center justify-center w-full h-12 text-4xl font-bold text-gray-800 profile bg-slate-100 rounded-xl'>
            {currentUser && currentUser.imageUrl ? (
              <div className='w-full h-full'>
                <img
                  src={currentUser.imageUrl}
                  width={'100%'}
                  height='100%'
                  className='w-full h-full rounded-xl'
                />
              </div>
            ) : (
              <div>
                <CiUser />
              </div>
            )}
          </div>
        </Link>
        <p className='text-xs text-center'>{currentUser && currentUser.name}</p>
      </div>
      <button
        className='flex items-center justify-center w-12 h-12 text-red-700 duration-700 bottom-2 left-2 bg-slate-300 hover:bg-red-700 hover:text-white animate-pulse rounded-xl text-red -900'
        onClick={logoutUser}
      >
        <MdLogout />
      </button>
    </aside>
  )
}

export default RoomAside
