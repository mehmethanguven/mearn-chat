import React, {
  FormEvent,
  KeyboardEvent,
  KeyboardEventHandler,
  useState,
} from 'react'
import { BiImageAdd } from 'react-icons/bi'
import { MdSend } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import {
  addMessage,
  getMessages,
  getUsersMessages,
} from '../services/features/messages/messageSlice'
import { AppDispatch } from '../services/store'

const ChatForm = () => {
  const [messageInput, setMessageInput] = useState('')
  const dispatch = useDispatch<AppDispatch>()
  const { contact } = useSelector((state: any) => state.contact)

  const handleChange = (e: any) => {
    setMessageInput(e.target.value)
  }
  const handleSend = async () => {
    const receiverID: string = contact._id
    await dispatch(addMessage({ content: messageInput, receiverID }))
    setMessageInput('')
  }
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSend()
    dispatch(getUsersMessages())
  }
  return (
    <div className='absolute bottom-0 left-0 right-0 p-0 bg-slate-600 text-slate-100 rounded-b-xl sm:p-1 min-h-max'>
      <form
        onSubmit={handleSubmit}
        className='flex items-center justify-between h-16 min-h-max sm:h-14'
      >
        {/* <span>icon</span> */}
        <div className='flex items-center w-full h-full mx-0 bg-slate-400 rounded-xl'>
          <textarea
            name=''
            id=''
            className='box-border w-full h-full px-1 m-0 text-gray-800 bg-gray-600 rounded-none sm:rounded-l-xl focus:outline-none sm:bg-slate-200'
            value={messageInput}
            onChange={handleChange}
            onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.code === 'Enter') handleSend()
            }}
          ></textarea>
          <button
            type='submit'
            className='flex items-center justify-center w-16 h-full text-2xl rounded-none sm:h-14 bg-slate-700 text-slate-200 sm:rounded-r-xl hover:animate-pulse hover:shadow-xl'
          >
            <MdSend size={20} />
          </button>
        </div>
      </form>
    </div>
  )
}

export default React.memo(ChatForm)
