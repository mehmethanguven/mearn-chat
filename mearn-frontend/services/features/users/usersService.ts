import axios from 'axios';
import { iUsersIDMessage } from '../../../utils/types';

// api
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URI;

const getUsers = async () => {
	const token = JSON.parse(localStorage.getItem('chat-gda-user')!).token;
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await axios.get(`${API_URL}/api/v1/users`, config);
	return res.data;
};

const messagesSerives = { getUsers };
export default messagesSerives;
