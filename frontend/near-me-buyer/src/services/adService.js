import { BASE_URL } from "@env";
var axios = require('axios');

export const adServices = {
    getAds
};

function getAds() {
    return axios.get(`${BASE_URL}/ads`)
    .then(res => {
        return res.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
       

}

