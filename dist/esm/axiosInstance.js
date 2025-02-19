import axios from 'axios';
import https from 'https';
export function createAxiosInstance(disableSslVerification) {
    return axios.create({
        httpsAgent: new https.Agent({
            rejectUnauthorized: !disableSslVerification, // Value comes from config
        }),
    });
}
