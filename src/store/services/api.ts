import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://192.168.100.41:8000/",
  // baseUrl: "https://api.tradermind.ai/",
  prepareHeaders: (headers, { getState }) => {
    return headers;
  },
});

export const signupApi = createApi({
  tagTypes: ["USER"],
  reducerPath: "signupApi",
  baseQuery,
  endpoints: (builder) => ({}),
});
