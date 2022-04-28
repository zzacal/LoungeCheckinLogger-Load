import http from "http";
import https from "https";
import axios, { AxiosRequestConfig } from "axios";

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

export const createAxios = (config: AxiosRequestConfig) =>
  axios.create({
    ...config,
  });
