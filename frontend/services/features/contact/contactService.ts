import axios from 'axios'
import { iUsersIDMessage } from '../../../utils/types'

// api
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URI

const getContact = async (id: string) => {
  const token = JSON.parse(localStorage.getItem('mstalk-user')!).token
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const res = await axios.get(`${API_URL}/api/v1/users/${id}`, config)
  console.log(res)
  if (res.status == 200)
    localStorage.setItem('chat-gda-contact', JSON.stringify(res.data.user))
  return res.data
}

const contactService = { getContact }
export default contactService
