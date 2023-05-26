import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../services/features/auth/authSlice';
import messageReducer from '../services/features/messages/messageSlice';
import contactReducer from './features/contact/contactSlice';
import userReducer from './features/users/usersSlice';

const store = configureStore({
	reducer: {
		auth: authReducer,
		messages: messageReducer,
		contact: contactReducer,
		users: userReducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
