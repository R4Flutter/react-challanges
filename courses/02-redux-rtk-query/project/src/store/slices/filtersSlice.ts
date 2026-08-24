import { createSlice } from '@reduxjs/toolkit'

const filtersSlice = createSlice({
  name: 'filters',
  initialState: { sortBy: 'newest' as 'newest' | 'oldest', filterUserId: null as number | null },
  reducers: {
    setSortBy: (state, action: { payload: 'newest' | 'oldest' }) => {
      state.sortBy = action.payload
    },
    setFilterUserId: (state, action: { payload: number | null }) => {
      state.filterUserId = action.payload
    },
  },
})

export const { setSortBy, setFilterUserId } = filtersSlice.actions
export const filtersReducer = filtersSlice.reducer