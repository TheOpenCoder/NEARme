import { BASE_URL } from "@env";
var axios = require('axios');

export const productServices = {
    searchProduct,
    allProductsFromCategory,
    getProductDetails
};

function searchProduct(searchTerm) {
    return axios.get(`${BASE_URL}/products?search=${searchTerm}`)
    .then(res => {
        return res.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
       

}

function allProductsFromCategory(category) {
    return axios.get(`${BASE_URL}/products?category=${category}`)
    .then(res => {
        return res.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
}

function getProductDetails(productId) {
    return axios.get(`${BASE_URL}/products/${productId}`)
    .then(res => {
        return res.data;
    })
    .catch(err => {
        return Promise.reject(err.response.data);
    })
}
