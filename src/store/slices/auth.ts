import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { setError, setLoading, setUser } from "./authSlice";
// import { setUser } from "./authSlice";

export const auth = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({ baseUrl: "http://192.168.100.41:8000/" }),
  // baseQuery: fetchBaseQuery({ baseUrl: "https://api.tradermind.ai/" }),
  endpoints: (builder) => ({
    // getUser: builder.query({
    //   query: (name) => ``,
    // }),
    registerUser: builder.mutation({
      query: (data: { email: string }) => ({
        url: `auth/register`,
        method: "POST",
        body: data,
      }),

      // async onQueryStarted(arg, { queryFulfilled, dispatch }) {
      //   console.log("queryFulfilled ", queryFulfilled);
      //   dispatch(setLoading(true));
      //   try {
      //     const { data } = await queryFulfilled;
      //     dispatch(setUser(data));
      //     console.log("queryFulfilled ", data);
      //   } catch (error:any) {
      //     dispatch(setError(error));
      //   } finally {
      //     dispatch(setLoading(false));
      //   }
      // },
    }),
  }),
});

export const { useRegisterUserMutation } = auth;
