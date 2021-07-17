import { BASE_URL } from "@env";
var axios = require('axios');

export const orderServices = {
    getOngoingOrders,
    getCompletedOrders
};

function getOngoingOrders(sellerId) {

    return axios.get(`${BASE_URL}/sellers/${sellerId}/orders?order_type=ongoing`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            return Promise.reject(err.response.data);
        })
}

function getCompletedOrders(sellerId) {

    return axios.get(`${BASE_URL}/sellers/${sellerId}/orders?order_type=completed`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            return Promise.reject(err.response.data);
        })
}

