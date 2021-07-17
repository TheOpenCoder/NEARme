import { BASE_URL } from "@env";
var axios = require('axios');

export const orderServices = {
    makeOrder,

};

function makeOrder(userId, data) {
    return axios.post(`${BASE_URL}/users/${userId}/orders`, data)
    .then(res => {
        return res.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
       

}
