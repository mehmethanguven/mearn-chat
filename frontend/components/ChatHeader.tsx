import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { VscChevronLeft } from 'react-icons/vsc'
import { useDispatch, useSelector } from 'react-redux'
import { getMessages } from '../services/features/messages/messageSlice'
import { AppDispatch } from '../services/store'
import Image from 'next/image'

const ChatHeader = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const { contact } = useSelector((state: any) => state.contact)

  useEffect(() => {
    if (!contact) router.replace('/')
    else dispatch(getMessages(contact._id))
  }, [contact])

  useEffect(() => {
    if (contact) {
      setSelectedContact(contact)
    }
  }, [contact])

  return (
    <div className='flex items-center w-full gap-2 p-2 text-white bg-slate-800 rounded-t-xl'>
      <div className='flex items-center justify-center w-12 h-12 text-2xl transition-all duration-700 rounded-full cursor-pointer bg-slate-800 hover:bg-slate-600'>
        <Link href='/'>
          <>
            {' '}
            <VscChevronLeft />
          </>
        </Link>
      </div>

      <div className='flex items-center justify-center rounded-full w-14 h-14 border-slate-100'>
        {selectedContact && selectedContact.imageUrl != undefined ? (
          <div className='flex items-center justify-center w-full h-full'>
            <img
              src={selectedContact.imageUrl}
              width={'100%'}
              height='100%'
              alt={selectedContact && selectedContact.name}
              className='w-full h-full rounded-full'
            />
          </div>
        ) : (
          <FaUserCircle className='w-full h-full text-slate-500' />
        )}
      </div>

      <div>
        <h2 className='text-2xl'>
          {selectedContact && selectedContact.name}{' '}
          {selectedContact && selectedContact.lastname}
        </h2>
        <h6 className='text-xs text-blue-500'>
          @{selectedContact && selectedContact.username}
        </h6>
      </div>
    </div>
  )
}

export default React.memo(ChatHeader)
