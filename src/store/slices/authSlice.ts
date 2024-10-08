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

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // setUser(state, action) {
    //   state.user = action.payload;
    //   console.log("REDUX state ", state);
    //   console.log("REDUX action ", action);
    // },
    // setError(state, action: PayloadAction<string | null>) {
    //   state.error = action.payload;
    // },
    // setLoading(state, action: PayloadAction<boolean>) {
    //   state.loading = action.payload;
    // },
  },
});

// export const { setUser, setError, setLoading } = authSlice.actions;
// export const selectUser = (state: any) => state.auth.user;
export default authSlice.reducer;
