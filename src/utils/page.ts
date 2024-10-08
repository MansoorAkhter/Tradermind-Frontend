const BASE_URL =
process.env.MODE === "production"
  ? process.env.API_BASE_URL_PRO
  : process.env.API_BASE_URL_DEV;



  export {BASE_URL}