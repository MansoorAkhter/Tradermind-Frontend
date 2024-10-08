import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any;
  error: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  // initialState,
  initialState: {
    user: null,
  },

  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state, action) {
      state.user =null;
    },
    // setError(state, action: PayloadAction<string | null>) {
    //   state.error = action.payload;
    // },
    // setLoading(state, action: PayloadAction<boolean>) {
    //   state.loading = action.payload;
    // },
  },
});

// export const { setUser, setError, setLoading } = userSlice.actions;
export const { setUser,clearUser } = userSlice.actions;
export const selectUser = (state: any) => state.user.user;
export default userSlice.reducer;
