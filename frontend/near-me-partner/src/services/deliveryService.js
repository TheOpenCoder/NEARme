import { BASE_URL } from "@env";
var axios = require('axios');

export const deliveryServices = {
    getDeliveryRequests,
    acceptDelivery,
    receivePackage,
    deliverPackage
};

function getDeliveryRequests(partnerId) {
  
    return axios.get(`${BASE_URL}/partners/${partnerId}/orders`)
    .then(req => {
        return req.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
       
}

function acceptDelivery(partnerId, data) {
    return axios.put(`${BASE_URL}/partners/${partnerId}/accept`, data)
    .then(req => {
        return req.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
}


function receivePackage(partnerId, data) {
    return axios.put(`${BASE_URL}/partners/${partnerId}/receive`, data)
    .then(req => {
        return req.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
}

function deliverPackage(partnerId, data) {
    return axios.put(`${BASE_URL}/partners/${partnerId}/deliver`, data)
    .then(req => {
        return req.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
}