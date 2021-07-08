import { BASE_URL } from "@env";
var axios = require('axios');

export const productServices = {
    addProduct,
    getSellerProducts
};

function addProduct(productData) {

    return axios.post(`${BASE_URL}/products`, productData)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            return Promise.reject(err.response.data.message);
        })


}

function getSellerProducts(sellerId) {
    return axios.get(`${BASE_URL}/sellers/${sellerId}/products`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return Promise.reject(err.response.data.message);
        })
}