import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { getContact } from '../services/features/contact/contactSlice'
import {
  getMessages,
  getUsersMessages,
} from '../services/features/messages/messageSlice'
import { getUsers } from '../services/features/users/usersSlice'
import { AppDispatch } from '../services/store'
import User from './skeleton/User'
import Image from 'next/image'

const AsideUsers = () => {
  const router = useRouter()
  const { user: connectedUser } = useSelector((state: any) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const { users, isLoading } = useSelector((state: any) => state.users)
  const { users: usersMessages, isLoading: isLoadingMsg } = useSelector(
    (state: any) => state.messages,
  )

  useEffect(() => {
    console.log(' ===>aside user useEffect')

    dispatch(getUsersMessages())
    dispatch(getUsers())
  }, [])

  const showDiscussion = (id: string) => {
    dispatch(getContact(id))
    router.replace('/messages')
  }

  return (
    <div className='flex-col hidden p-2 pt-2 pl-0 my-0 ml-0 mr-0 rounded-none sm:flex top-2 bottom-2 w-80 bg-slate-700 '>
      <div className='overflow-y-scroll users min-w-max'>
        <h2 className='text-2xl  font-extrabold  p-2 bg-gray-900  text-blue-400  z-[100] sticky top-0 rounded-r-full'>
          Messages
        </h2>
        {isLoadingMsg ? (
          <div className='flex flex-col flex-wrap items-end justify-end w-full p-2 text-slate-100 skeleton'>
            <User />
            <User />
            <User />
          </div>
        ) : (
          <>
            {usersMessages && usersMessages.length > 0 ? (
              <div className=''>
                {usersMessages.map((user: any) => (
                  <div key={user._id}>
                    {user?._id.toString() != connectedUser?._id.toString() ? (
                      <div
                        key={user._id}
                        className='flex flex-row items-center p-2 my-2 mr-2 text-white duration-700 rounded hover:bg-blue-800 hover:animate-pulse min-w-max'
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
                            <h5>{user.message?.substring(0, 16)} ...</h5>
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
              <div className='flex flex-col flex-wrap items-end justify-end w-full p-2 pb-20 text-slate-100'>
                <User />
                <User />
                <User />
              </div>
            )}
          </>
        )}
        <div className='w-full'>
          {isLoading ? (
            <div className='flex flex-col flex-wrap items-end justify-end w-full p-2 text-slate-100'>
              <h2 className='text-2xl  font-extrabold  p-2 bg-gray-800  text-blue-400 sticky top-0  z-[100] rounded-r-full'>
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
                  <h2 className='text-2xl ml-0 p-2 font-extrabold text-blue-400 pt-2 sticky top-0 bg-gray-900 rounded-none z-[100] rounded-r-full'>
                    Contacts
                  </h2>
                  {users.map((user: any) => (
                    <div key={user._id}>
                      {user?._id.toString() != connectedUser?._id.toString() ? (
                        <div
                          key={user._id}
                          className='flex flex-row items-center p-2 my-2 mr-2 text-white duration-700 rounded hover:bg-blue-800 hover:animate-pulse min-w-max'
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
                          <div>
                            <h3 className='cursor-pointer text-md'>
                              <span>{user.name}</span>{' '}
                              <span>{user.lastname}</span>
                            </h3>
                            <div className='flex justify-between w-full text-xs text-slate-400'>
                              <h5>@{user.username}</h5>
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
                <p>Les autres membres ne sont pas disponibles</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AsideUsers
