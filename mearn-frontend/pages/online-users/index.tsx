import { ReactElement } from 'react'
import { useSocket } from '../../hooks/useSocket'

const OnlineUsersPage = () => {
  const { onlineUsers, emitLogout } = useSocket()

  return (
    <div className='p-4'>
      {/* <h1>CurrentUser: {user && user.email}</h1> */}
      <button
        onClick={() => emitLogout()}
        className='p-2 m-5 text-white bg-red-500 rounded-lg'
      >
        Send Logout
      </button>

      <div className='py-5'>
        {onlineUsers && onlineUsers.length > 0 ? (
          onlineUsers.map((i: any, idx: any) => <div key={idx}>{i.email}</div>)
        ) : (
          <div>No online user found</div>
        )}
      </div>
    </div>
  )
}

// OnlineFriendsPage.getLayout = (page: ReactElement) => {
//   return (
//     <AppLayout header={<FriendHeader />} sidebar={<FriendSidebar />}>
//       {page}
//     </AppLayout>
//   );
// };

export default OnlineUsersPage
