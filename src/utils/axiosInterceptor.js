
import axios from "axios";
import { BASE_URL } from "./constants.js";

let axiosInstance = axios.create({
    baseURL : BASE_URL
})