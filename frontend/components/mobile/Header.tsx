import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { FaHome, FaUser, FaUserCircle } from 'react-icons/fa'
import { MdLogout } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../services/features/auth/authSlice'
import { AppDispatch } from '../../services/store'

const Header = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const logoutUser = () => {
    dispatch(logout())
    router.replace('/auth/login')
  }
  return (
    <div className='flex items-center justify-between w-full p-2 bg-slate-200 sm:hidden'>
      <div className='flex items-center justify-center w-16 h-16 rounded-full cursor-pointer border-slate-100'>
        <Link href='/auth/profil'>
          <div className='flex items-center justify-center w-full h-full'>
            <FaUser className='text-3xl text-slate-500' />
          </div>
        </Link>

        <Link href='/'>
          <div className='flex items-center justify-center w-full h-full'>
            <FaHome className='text-3xl text-slate-500' />
          </div>
        </Link>
        {/* {router.route !== '/auth/profil' ? (
          <Link href='/auth/profil'>
            <div className='flex items-center justify-center w-full h-full'>
              <FaUser className='text-3xl text-slate-500' />
            </div>
          </Link>
        ) : (
          <Link href='/'>
            <div className='flex items-center justify-center w-full h-full'>
              <FaHome className='text-3xl text-slate-500' />
            </div>
          </Link>
        )} */}
      </div>
      <div>
        <h2 className='font-extrabold text-slate-800'>MSTalk</h2>
      </div>
      <button
        className='flex items-center justify-center w-12 h-12 text-red-700 duration-700 bottom-2 left-2 bg-slate-300 hover:bg-red-700 hover:text-white animate-pulse rounded-xl text-red -900'
        onClick={logoutUser}
      >
        <MdLogout />
      </button>
    </div>
  )
}

export default Header
