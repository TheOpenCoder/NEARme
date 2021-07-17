import { BASE_URL } from "@env";
var axios = require('axios');

export const adServices = {
    createAd
};

function createAd(data) {
    return axios.post(`${BASE_URL}/ads`, data)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            return Promise.reject(err.response.data);
        })
}

