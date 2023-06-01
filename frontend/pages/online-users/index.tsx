import { ReactElement, useEffect, useState } from 'react'
import { useSocket } from '../../hooks/useSocket'
import { OnlineUser } from '../../types/online-user'
import OnlineUserPage from '../../components/OnlineUserPage'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getUsers } from '../../services/features/users/usersSlice'
import { AppDispatch } from '../../services/store'

const OnlineUsersPage = () => {
  const { onlineUsers, emitLogout } = useSocket()

  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
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

  return (
    <div className='p-4'>
      {/* <h1>CurrentUser: {user && user.email}</h1> */}
      <button
        onClick={() => emitLogout()}
        className='p-2 m-5 text-white bg-red-500 rounded-lg'
      >
        Send Logout
      </button>

      <div className='flex gap-4 py-5'>
        {onlineUsers && onlineUsers.length > 1 ? (
          onlineUsers
            .filter((i) => i.id !== user._id)
            .map((user: OnlineUser) => (
              <OnlineUserPage key={user.id} user={user} />
            ))
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
