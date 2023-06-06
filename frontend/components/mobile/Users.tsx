import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { MdLogout } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../services/features/auth/authSlice'
import { getContact } from '../../services/features/contact/contactSlice'
import { AppDispatch } from '../../services/store'
import User from '../skeleton/User'
import Header from './Header'

const AsideUsers = () => {
  const router = useRouter()

  const {
    users: usersMessages,
    isError: errMess,
    errorMessage: isLoadingMsg,
  } = useSelector((state: any) => state.messages)
  const dispatch = useDispatch<AppDispatch>()

  const showDiscussion = (id: string) => {
    dispatch(getContact(id))
    router.replace('/messages')
  }

  const { user: connectedUser } = useSelector((state: any) => state.auth)
  const { users, isLoading } = useSelector((state: any) => state.users)
  return (
    <div className='flex flex-col w-screen p-0 m-0 bg-gray-200 rounded-none sm:hidden top-2 bottom-2 '>
      <Header />
      {/* main users */}
      <div className='h-full overflow-y-scroll users min-w-max'>
        {isLoadingMsg ? (
          <div className='flex flex-col flex-wrap items-end justify-end w-full p-2 text-slate-100'>
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
              <div className='pt-2 bg-gray-50'>
                <h2 className='text-2xl ml-2 font-extrabold text-gray-800 sticky top-0 z-[100] bg-gray-200 p-2 rounded-lg'>
                  Messages
                </h2>

                {usersMessages.map((user: any) => (
                  <div key={user._id}>
                    {user?._id.toString() != connectedUser?._id.toString() ? (
                      <div
                        key={user._id}
                        className='flex flex-row items-center p-2 my-2 mr-2 duration-700 rounded hover:bg-blue-800 hover:animate-pulse min-w-max'
                        onClick={() => showDiscussion(user._id)}
                      >
                        <div className='flex items-center justify-center w-10 h-10 p-0 mr-2 text-5xl font-bold text-gray-800 rounded-full cursor-pointer profile-img border-slate-50'>
                          {user && user.imageUrl != undefined ? (
                            <div className='w-full h-full'>
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
                          <h3 className='cursor-pointer text-md'>
                            <span>{user.name}</span>{' '}
                            <span>{user.lastname}</span>
                          </h3>
                          <div className='flex justify-between w-full text-xs text-slate-400'>
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
              <p>you don't have conversations yet</p>
            )}
          </>
        )}
        {isLoading ? (
          <div className='flex flex-col flex-wrap items-end justify-end w-full p-2 text-slate-100'>
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
              <div className='pt-1 bg-gray-50'>
                <h2 className='text-2xl ml-2 font-extrabold text-gray-800 sticky top-0 z-[100] bg-gray-200 p-2 rounded-lg mt-2'>
                  Contacts
                </h2>

                {users.map((user: any) => (
                  <div key={user._id}>
                    {user?._id.toString() != connectedUser?._id.toString() ? (
                      <div
                        key={user._id}
                        className='flex flex-row items-center p-2 my-2 mr-2 duration-700 rounded hover:bg-blue-800 hover:animate-pulse min-w-max'
                        onClick={() => showDiscussion(user._id)}
                      >
                        <div className='flex items-center justify-center w-12 h-12 p-0 mr-2 text-5xl font-bold rounded-full cursor-pointer profile-img border-slate-50 text-slate-600'>
                          {user && user.imageUrl != undefined ? (
                            <div className='w-full h-full'>
                              <img
                                src={user.imageUrl}
                                width={'100%'}
                                height='100%'
                                className='w-full h-full rounded-full'
                              />
                            </div>
                          ) : (
                            <div>
                              <FaUserCircle className='w-12 h-12 ' />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className='cursor-pointer '>
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
              <p>Other members are not available</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AsideUsers
