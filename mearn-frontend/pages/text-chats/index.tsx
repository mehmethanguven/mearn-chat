import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../../styles/Home.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../services/features/auth/authSlice'
import { getUsers } from '../../services/features/users/usersSlice'
import { useEffect, useState } from 'react'
import { AppDispatch } from '../../services/store'
import Link from 'next/link'
import RoomAside from '../../components/RoomAside'
import AsideMobileUsers from '../../components/mobile/Users'
import AsideUsers from '../../components/AsideUsers'
import { MdMessage } from 'react-icons/md'
import { toast } from 'react-toastify'

const TextChatsPage = () => {
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
    if (!user) router.push('/auth/login')
    setCurrentUser(user)
  }, [])

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Crypto chat</title>
          <meta name='description' content='Generated by create next app' />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <main className='fixed top-0 bottom-0 left-0 right-0 flex bg-blue-900 '>
          <RoomAside />

          {/* aside for users */}
          <AsideUsers />
          <AsideMobileUsers />

          {/* Main messages */}
          <div className='flex-col items-center justify-center hidden w-full p-4 mx-2 my-2 text-center bg-gray-900 sm:flex top-2 bottom-2 left-20 rounded-xl'>
            {currentUser && (
              <>
                <h2 className='m-2 text-3xl font-extrabold text-slate-100'>
                  Welcome{' '}
                  <span className='text-blue-900'>
                    {currentUser && currentUser?.name}
                  </span>{' '}
                  <span className='text-blue-900'>
                    {currentUser && currentUser?.lastname}
                  </span>
                </h2>
                <p className='text-slate-50'>
                  Select please one contact to start a chat{' '}
                </p>
                <h5 className='mt-5 text-white text-8xl animate-pulse'>
                  <MdMessage />
                </h5>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  )
}

export default TextChatsPage
