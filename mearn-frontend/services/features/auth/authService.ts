import {
	iUserSignupInput,
	iUserLoginInput,
	iUserInput,
} from '../../../utils/types';
import axios from 'axios';

// api
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URI;

const registerUser = async (userData: iUserSignupInput) => {
	const res = await axios.post(`${API_URL}/api/v1/users/signup`, userData);
	localStorage.setItem('chat-gda-user', JSON.stringify(res.data));
	return res.data;
};

//  login func
const loginUser = async (user: iUserLoginInput) => {
	const res = await axios.post(`${API_URL}/api/v1/users/login`, user);
	localStorage.setItem('chat-gda-user', JSON.stringify(res.data));
	return res.data;
};

// logout func
const logout = async () => {
	localStorage.removeItem('chat-gda-user');
};

const updateImage = async (file: FormData, token: string) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await axios.post(`${API_URL}/api/v1/users/image`, file, config);
	return res.data;
};

const updateUser = async (user: iUserInput, token: string) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await axios.post(`${API_URL}/api/v1/users/image`, user, config);
	return res.data;
};

const authService = {
	loginUser,
	registerUser,
	logout,
	updateImage,
	updateUser,
};

export default authService;
