import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: [] }

export const favouriteSlice = createSlice({
  name: 'Favoritos',
  initialState,
  reducers: {
    setFavouriteList: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setFavouriteList } = favouriteSlice.actions

export default favouriteSlice.reducer