import React, { useEffect, useState } from 'react'
import { VscArrowDown } from 'react-icons/vsc'
import { useSelector } from 'react-redux'

const ChatItems = () => {
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const { user } = useSelector((state: any) => state.auth)
  const { contact } = useSelector((state: any) => state.contact)
  const { messages, isError } = useSelector((state: any) => state.messages)
  useEffect(() => {
    if (contact) {
      setSelectedContact(contact)
    }

    return () => {}
  }, [])
  return (
    <div className='p-4 overflow-y-scroll text-white'>
      {messages && messages.length > 0 ? (
        <div className='pb-20 sm:pb-16'>
          {messages.map((msg: any) => (
            <div className='flex flex-col h-full ' key={msg._id}>
              {msg.sender === user?._id.toString() ? (
                <div className='self-end max-w-full p-4 m-2 bg-blue-900 rounded-br-none w-max rounded-2xl'>
                  <div className='flex items-center justify-between w-full mb-2'>
                    <h6 className='text-xs text-slate-400'>
                      <span>{msg.sender && msg.sender.name}</span>{' '}
                      <span>{msg.sender && msg.sender.lastname}</span>
                    </h6>
                    <span className='text-blue-900'> __ </span>
                    <h6 className='text-xs text-slate-400'>
                      {new Date(msg.updatedAt).toLocaleTimeString()}
                    </h6>
                  </div>
                  <p className='w-full p-1 text-sm md:text-lg h-max'>
                    {msg.content}
                  </p>
                </div>
              ) : (
                <div className='self-start max-w-full p-2 m-2 rounded-bl-none bg-slate-700 w-max rounded-2xl'>
                  <div className='flex items-center justify-between mb-2'>
                    <h6 className='text-xs text-slate-400'>
                      <span>{selectedContact && selectedContact.name}</span>
                      <span>{selectedContact && selectedContact.lastname}</span>
                    </h6>
                    <span className='text-slate-700'> __ </span>

                    <h6 className='text-xs text-slate-400'>
                      {new Date(msg.updatedAt).toLocaleTimeString()}
                    </h6>
                  </div>
                  <p className='text-sm md:text-lg'>{msg.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className='absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center'>
          <h3 className='text-3xl font-extrabold text-blue-800'>
            <span>{selectedContact && selectedContact.name}</span>{' '}
            <span>{selectedContact && selectedContact.lastname}</span>
          </h3>
          <p>You can start the conversation </p>
          <span>
            <VscArrowDown className='text-4xl font-extrabold animate-bounce' />
          </span>
        </div>
      )}
      {isError && (
        <div className='flex items-center justify-center w-full h-full'>
          <p>An error occurred while loading messages</p>
        </div>
      )}
    </div>
  )
}

export default React.memo(ChatItems)
