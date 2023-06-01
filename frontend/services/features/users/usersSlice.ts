import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userSerives from './usersService';

const initialState = {
	users: [],
	isError: false,
	isLoading: false,
	isSuccess: false,
	errorMessage: '',
};

//  get all users
export const getUsers = createAsyncThunk(
	'user/getUsers',
	async (_, thunkAPI) => {
		try {
			return await userSerives.getUsers();
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

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		reset: () => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addCase(getUsers.pending, (state) => {
				state.isLoading = true;
				state.isSuccess = false;
				state.isError = false;
			})
			.addCase(getUsers.fulfilled, (state, action) => {
				state.isLoading = false;
				state.users = action.payload.users;
				state.isSuccess = true;
				state.isError = false;
			})
			.addCase(getUsers.rejected, (state, action) => {
				state.isLoading = false;
				state.users = [];
				state.isSuccess = false;
				state.isError = true;
				state.errorMessage = action.payload as string;
			});
	},
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
