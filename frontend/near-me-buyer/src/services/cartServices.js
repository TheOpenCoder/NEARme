import { BASE_URL } from "@env";
var axios = require('axios');

export const cartServices = {
    addToBag,
    getProductsInBag,
    deleteProductInBag
};

function addToBag(userId, productId, quantity) {

    return axios.post(`${BASE_URL}/users/${userId}/bag`, { "product_id": productId, "quantity": quantity })
        .then(user => {
            console.log(user.data);
            return user.data;
        })
        .catch(err => {
            return Promise.reject(err.response.data);
        })


}

function getProductsInBag(userId) {

    return axios.get(`${BASE_URL}/users/${userId}/bag`)
        .then(user => {
            return user.data;
        })
        .catch(err => {
            return Promise.reject(err.response.data);
        })

}

function deleteProductInBag(userId, productId) {

    var config = {
        method: 'delete',
        url: `${BASE_URL}/users/${userId}/bag`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: productId
    };

    return axios(config)
        .then(user => {
            return user.data;
        })
        .catch(err => {
            console.log(err);
            return Promise.reject(err);
        })


}