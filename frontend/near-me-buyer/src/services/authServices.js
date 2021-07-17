import { BASE_URL } from "@env";
var axios = require('axios');

export const authServices = {
    registerUser,
    loginUser,
    updateLendLimit,
    setRapydCredentials,
    updateKyc
};

function registerUser(userData) {
  
    return axios.post(`${BASE_URL}/users`, userData)
    .then(user => {
        return user.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
       

}

function loginUser(userCredentials) {
  
    return axios.post(`${BASE_URL}/users/login`, userCredentials)
    .then(user => {
        return user.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
       

}

function updateLendLimit(userId, limit) {
    return axios.put(`${BASE_URL}/users/${userId}/lendlimit`, limit)
    .then(user => {
        return user.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
}


function setRapydCredentials(userId, creds) {
    return axios.put(`${BASE_URL}/users/${userId}/creds`, creds)
    .then(res => {
        return res.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
}

function updateKyc(userId, verified) {
    return axios.put(`${BASE_URL}/users/${userId}/kyc`, {"kyc_verified": verified})
    .then(res => {
        return res.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
}