import { BASE_URL } from "@env";
var axios = require('axios');

export const wishlistServices = {
    addToWishlist,
    getProductsInWishlist,
    deleteProductInWishlist
};

function addToWishlist(userId, productId) {

    return axios.post(`${BASE_URL}/users/${userId}/wishlist`, { "product_id": productId })
        .then(user => {
            return user.data;
        })
        .catch(err => {
            return Promise.reject(err.response.data);
        })


}

function getProductsInWishlist(userId) {

    return axios.get(`${BASE_URL}/users/${userId}/wishlist`)
        .then(user => {
            return user.data;
        })
        .catch(err => {
            return Promise.reject(err.response.data);
        })

}

function deleteProductInWishlist(userId, productId) {

    var config = {
        method: 'delete',
        url: `${BASE_URL}/users/${userId}/wishlist`,
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
            return Promise.reject(err);
        })


}