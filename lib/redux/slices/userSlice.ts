import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@/lib/types"

interface UserState {
  currentUser: User | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
}

export const fetchOrCreateUser = createAsyncThunk("user/fetchOrCreate", async (walletAddress: string) => {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress }),
  })
  if (!response.ok) throw new Error("Failed to fetch/create user")
  return response.json()
})

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.currentUser = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrCreateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrCreateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addCase(fetchOrCreateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch user"
      })
  },
})

export const { clearUser } = userSlice.actions
export default userSlice.reducer
