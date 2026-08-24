import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { mockApi } from '../../api/mockServer'
import type { User } from '../../api/mockServer'

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await mockApi.getUsers()
  return response
})

const usersSlice = createSlice({
  name: 'users',
  initialState: { list: [] as User[], loading: false, error: null as string | null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to fetch users'
      })
  },
})

export const usersReducer = usersSlice.reducer