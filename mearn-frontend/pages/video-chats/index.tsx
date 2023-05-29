import Link from 'next/link'

const VideoChatsPage = () => {
  return (
    <div className='p-4'>
      Video Chats Page
      <div className='p-2 mt-5 text-center text-white bg-red-500 rounded-lg shadow-lg w-28'>
        <Link href='/'>Home</Link>
      </div>
    </div>
  )
}

export default VideoChatsPage
