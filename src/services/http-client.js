import axios from "axios";

const cityAPI = axios.create({
  baseURL: "https://public.opendatasoft.com/api/explore/v2.1",
});

const weatherAPI = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
});


export {cityAPI,weatherAPI};
