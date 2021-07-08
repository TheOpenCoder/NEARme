import { BASE_URL } from "@env";
var axios = require('axios');

export const authServices = {
    registerSeller,
    loginSeller
};

function registerSeller(sellerData) {
  
    return axios.post(`${BASE_URL}/sellers`, sellerData)
    .then(user => {
        return user.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data.message);
    })
       

}

function loginSeller(sellerCredentials) {
  
    return axios.post(`${BASE_URL}/sellers/login`, sellerCredentials)
    .then(user => {
        return user.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data.message);
    })
       

}
