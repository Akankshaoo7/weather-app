import {weatherAPI} from "../http-client";
const API_KEY = import.meta.env.VITE_WEATHER_KEY;

const getForecast = (place) => {
    return weatherAPI.get(`/forecast?q=${place}&appid=${API_KEY}&cnt=56`);
}

const getForecastByLatLong = (latitude,longitude) => {
    return weatherAPI.get(`/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
}

const getLocations = (value) => {
    return weatherAPI.get(`/find?q=${value}&appid=${API_KEY}`);
}


export { getForecast, getLocations, getForecastByLatLong};