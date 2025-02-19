import axios, { AxiosInstance } from 'axios';
import https from 'https';

export function createAxiosInstance(disableSslVerification: boolean): AxiosInstance {
  return axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: !disableSslVerification, // Value comes from config
    }),
  });
}