import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Launch } from "@/lib/types"

interface LaunchesState {
  launches: Launch[]
  loading: boolean
  error: string | null
}

const initialState: LaunchesState = {
  launches: [],
  loading: false,
  error: null,
}

export const fetchLaunches = createAsyncThunk("launches/fetchAll", async () => {
  const response = await fetch("/api/launches")
  if (!response.ok) throw new Error("Failed to fetch launches")
  return response.json()
})

export const fetchLaunchById = createAsyncThunk("launches/fetchById", async (id: string) => {
  const response = await fetch(`/api/launches/${id}`)
  if (!response.ok) throw new Error("Failed to fetch launch")
  return response.json()
})

export const createLaunch = createAsyncThunk("launches/create", async (launchData: any) => {
  const response = await fetch("/api/launches", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(launchData),
  })
  if (!response.ok) throw new Error("Failed to create launch")
  return response.json()
})

export const updateLaunch = createAsyncThunk(
  "launches/update",
  async ({ id, updates }: { id: string; updates: Partial<Launch> }) => {
    const response = await fetch(`/api/launches/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!response.ok) throw new Error("Failed to update launch")
    return response.json()
  },
)

const launchesSlice = createSlice({
  name: "launches",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLaunches.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLaunches.fulfilled, (state, action: PayloadAction<Launch[]>) => {
        state.loading = false
        state.launches = action.payload
      })
      .addCase(fetchLaunches.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch launches"
      })
      .addCase(createLaunch.fulfilled, (state, action: PayloadAction<Launch>) => {
        state.launches.push(action.payload)
      })
      .addCase(updateLaunch.fulfilled, (state, action: PayloadAction<Launch>) => {
        const index = state.launches.findIndex((l) => l._id === action.payload._id)
        if (index !== -1) {
          state.launches[index] = action.payload
        }
      })
  },
})

export const { clearError } = launchesSlice.actions
export default launchesSlice.reducer
