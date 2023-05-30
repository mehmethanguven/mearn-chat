import { useContext } from 'react'
import { OnlineUsersContext } from '../../contexts/online-users-context'

const useOnlineUsers = () => {
  return { ...useContext(OnlineUsersContext) }
}

export default useOnlineUsers
