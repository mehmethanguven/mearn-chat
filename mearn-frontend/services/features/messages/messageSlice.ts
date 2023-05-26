import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import messagesSerives from './messageService';
import { iThunkAPIUser, iUsersIDMessage } from '../../../utils/types';

type iMessageState = {
	messages: any[];
	isError: boolean;
	isLoading: boolean;
	isSuccess: boolean;
	errorMessage: string;
	users: any;
};

const initialState: iMessageState = {
	messages: [],
	isError: false,
	isLoading: false,
	isSuccess: false,
	errorMessage: '',
	users: [],
};

//  get all users

// get messages from user connected
export const getMessages = createAsyncThunk(
	'message/getMessages',
	async (receiverId: string, thunkAPI) => {
		const { auth } = thunkAPI.getState() as iThunkAPIUser;
		const { token } = auth.user;
		try {
			return await messagesSerives.getMessages(receiverId, token);
		} catch (error: any) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();
			return thunkAPI.rejectWithValue(message);
		}
	}
);

// get messages from user connected
export const getUsersMessages = createAsyncThunk(
	'message/getUserMessages',
	async (_, thunkAPI) => {
		const { auth } = thunkAPI.getState() as iThunkAPIUser;
		const { token } = auth.user;
		try {
			return await messagesSerives.getUserMessages(token);
		} catch (error: any) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();
			return thunkAPI.rejectWithValue(message);
		}
	}
);

// create new message
export const addMessage = createAsyncThunk(
	'message/addMessage',
	async (usersData: any, thunkAPI) => {
		const { auth } = thunkAPI.getState() as iThunkAPIUser;
		const { token } = auth.user;
		const { content, receiverID } = usersData;
		console.log(usersData);
		try {
			return await messagesSerives.addMessage(content, receiverID, token);
		} catch (error: any) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();
			return thunkAPI.rejectWithValue(message);
		}
	}
);

const messageSlice = createSlice({
	name: 'message',
	initialState,
	reducers: {
		reset: () => initialState,
	},
	extraReducers: (builder) => {
		builder

			.addCase(getMessages.pending, (state) => {
				state.isLoading = true;
				state.isSuccess = false;
				state.messages = [];

				state.isError = false;
			})
			.addCase(getMessages.fulfilled, (state, action) => {
				state.isLoading = false;
				state.messages = action.payload;
				state.isSuccess = true;
			})
			.addCase(getMessages.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.errorMessage = action.payload as string;
			})
			.addCase(getUsersMessages.pending, (state) => {
				state.isLoading = true;
				state.isSuccess = false;
				state.isError = false;
			})
			.addCase(getUsersMessages.fulfilled, (state, action) => {
				let data: any[] = [];
				action.payload.map((ele: any) => {
					ele.users.map((user: any) => {
						const u = {
							_id: user._id,
							name: user.name,
							lastname: user.lastname,
							username: user.username,
							message: ele.content,
							date: ele.createdAt,
							imageUrl: ele.imageUrl,
						};
						data.push(u);
					});
				});

				const filteredUsers = data.filter(
					(val: any, i: number, self: any) =>
						self.findIndex((m: any) => m.name === val.name) === i
				);
				state.isLoading = false;
				state.users = filteredUsers.reverse();
				state.isSuccess = true;
				state.messages = state.messages;
			})
			.addCase(getUsersMessages.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.errorMessage = action.payload as string;
			})
			.addCase(addMessage.pending, (state) => {
				state.isLoading = true;
				state.isSuccess = false;
				state.isError = false;
			})
			.addCase(addMessage.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.messages.push(action.payload);
			})
			.addCase(addMessage.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.errorMessage = action.payload as string;
			});
	},
});

export const { reset } = messageSlice.actions;
export default messageSlice.reducer;
