import axios from "axios";

const API_URL = "https://www.dimepkairos.com.br/RestServiceApi";

const HEADERS = {
  "Content-Type": "application/json",
  identifier: "04286673000100",
  key: "75ca7a56-f35e-4c10-b643-be41a10e0e39",
};

export const apiKairos = axios.create({
  baseURL: API_URL,
  headers: HEADERS,
});