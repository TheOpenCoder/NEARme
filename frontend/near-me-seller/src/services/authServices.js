import { BASE_URL } from "@env";
var axios = require('axios');

export const authServices = {
    registerSeller,
    loginSeller,
    setRapydCredentials,
    updateKyc
};

function registerSeller(sellerData) {
  
    return axios.post(`${BASE_URL}/sellers`, sellerData)
    .then(user => {
        return user.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
       

}

function loginSeller(sellerCredentials) {
  
    return axios.post(`${BASE_URL}/sellers/login`, sellerCredentials)
    .then(user => {
        return user.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
       

}




function setRapydCredentials(sellerId, creds) {
    return axios.put(`${BASE_URL}/sellers/${sellerId}/creds`, creds)
    .then(res => {
        return res.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
}

function updateKyc(sellerId, verified) {
    return axios.put(`${BASE_URL}/sellers/${sellerId}/kyc`, {"kyc_verified": verified})
    .then(res => {
        return res.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
}