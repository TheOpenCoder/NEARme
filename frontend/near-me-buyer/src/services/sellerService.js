import { BASE_URL } from "@env";
var axios = require('axios');

export const sellerServices = {
    getSellerDetails,
    getSellerProducts,
    allSellerFromCategory
};

function getSellerDetails(sellerId) {
    
    return axios.get(`${BASE_URL}/sellers/${sellerId}`)
    .then(res => {
        return res.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
}

function getSellerProducts(sellerId) {
    return axios.get(`${BASE_URL}/sellers/${sellerId}/products`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            return Promise.reject(err.response.data);
        })
}

function allSellerFromCategory(category) {
    return axios.get(`${BASE_URL}/sellers?category=${category}`)
    .then(res => {
        return res.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
}
