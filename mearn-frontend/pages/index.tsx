// 'use client';

import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../services/features/auth/authSlice'
import { getUsers } from '../services/features/users/usersSlice'
import { useEffect, useState } from 'react'
import { AppDispatch } from '../services/store'
import Link from 'next/link'
import RoomAside from '../components/RoomAside'
import AsideMobileUsers from '../components/mobile/Users'
import AsideUsers from '../components/AsideUsers'
import { MdMessage } from 'react-icons/md'
import { toast } from 'react-toastify'

export default function Home() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const {
    user,
    isError: isErrorUser,
    errorMessage: errorUser,
  } = useSelector((state: any) => state.auth)
  const { isError: isErrorMessages, errorMessage: errorMessages } = useSelector(
    (state: any) => state.messages,
  )

  const { isError: isErrorUsers, errorMessage: errorUsers } = useSelector(
    (state: any) => state.users,
  )

  useEffect(() => {
    if (!user) router.push('/auth/login')
    else dispatch(getUsers())
  }, [user, dispatch])

  useEffect(() => {
    if (isErrorMessages) toast.dark(errorMessages)
    if (isErrorUser) toast.dark(errorUser)
    if (isErrorUsers) toast.error(errorUsers)
  }, [isErrorMessages, isErrorUser])

  useEffect(() => {
    setCurrentUser(user)

    return () => {}
  }, [])

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Chat</title>
          <meta name='description' content='Generated by create next app' />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <div className='flex gap-2'>
          <div className='p-2 mt-5 text-center text-white bg-blue-500 rounded-lg shadow-lg w-28'>
            <Link href='/text-chats'>Text Chats</Link>
          </div>
          <div className='p-2 mt-5 text-center text-white bg-red-500 rounded-lg shadow-lg w-28'>
            <Link href='/video-chats'>Video Chats</Link>
          </div>
        </div>
      </div>
    </>
  )
}
