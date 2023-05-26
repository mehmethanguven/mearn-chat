import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import contactService from './contactService'

//  initial state
let contact
if (typeof window !== 'undefined') {
  if (localStorage.getItem('chat-gda-contact')) {
    contact = JSON.parse(localStorage.getItem('chat-gda-contact')!)
    contact.imageUrl = contact.imageUrl ? contact.imageUrl : null
  } else {
    contact = null
  }
}

const initialState = {
  contact: contact || null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  errorMessage: '',
}

//  get all users
export const getContact = createAsyncThunk(
  'user/getContact',
  async (id: string, thunkAPI) => {
    try {
      return await contactService.getContact(id)
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  },
)

// get messages from user connected

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContact.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
        state.isError = false
      })
      .addCase(getContact.fulfilled, (state, action) => {
        state.isLoading = false
        state.contact = action.payload.user
        state.isSuccess = true
        state.isError = false
      })
      .addCase(getContact.rejected, (state, action) => {
        state.isLoading = false
        state.contact = null
        state.isSuccess = false
        state.isError = true
        state.errorMessage = action.payload as string
      })
  },
})

export const { reset } = contactSlice.actions
export default contactSlice.reducer
