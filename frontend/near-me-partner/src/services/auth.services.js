import { BASE_URL } from "@env";
var axios = require('axios');

export const authServices = {
    registerPartner,
    loginPartner,
    setRapydCredentials,
    updateKyc
};

function registerPartner(partnerData) {
  
    return axios.post(`${BASE_URL}/partners`, partnerData)
    .then(partner => {
        return partner.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
       

}

function loginPartner(partnerCredentials) {
  
    return axios.post(`${BASE_URL}/partners/login`, partnerCredentials)
    .then(partner => {
        return partner.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
       

}



function setRapydCredentials(userId, creds) {
    return axios.put(`${BASE_URL}/partners/${userId}/creds`, creds)
    .then(res => {
        return res.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
}

function updateKyc(userId, verified) {
    return axios.put(`${BASE_URL}/partners/${userId}/kyc`, {"kyc_verified": verified})
    .then(res => {
        return res.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
}