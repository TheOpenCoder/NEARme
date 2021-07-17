import { cartConstants } from '../constants';
import { cartServices } from '../../services';
import { alertActions } from './alertActions';
import { cartHelper } from '../../helpers';

export const cartActions = {
    getProductsInBag,
    deleteProductInBag,
    addToBag,
    clearBag,
    handleQuantityChange
};



function getProductsInBag(userId) {

    return dispatch => {
        dispatch(request());
        cartServices.getProductsInBag(userId)
            .then(
                cartItems => {
                    dispatch(success(cartItems));
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));
                    return Promise.reject(error);
                }
            );
    };

    function request() { return { type: cartConstants.GET_REQUEST } }
    function success(cartItems) { return { type: cartConstants.GET_SUCCESS, cartItems } }
    function failure() { return { type: cartConstants.GET_FAILURE } }
}

function deleteProductInBag(userId, productId, product, carts) {

    return dispatch => {
        dispatch(request());
        cartServices.deleteProductInBag(userId, productId)
            .then(
                res => {
                    const cartItems = cartHelper.HandleRemoveProductFromCart(product, carts);
                    dispatch(success(cartItems));
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));
                    return Promise.reject(error);
                }
            );
    };

    function request() { return { type: cartConstants.REMOVE_REQUEST } }
    function success(cartItems) { return { type: cartConstants.REMOVE_SUCCESS, cartItems } }
    function failure() { return { type: cartConstants.REMOVE_FAILURE } }
}





function addToBag(userId, productId, quantity, product, carts) {

    return dispatch => {
        dispatch(request());
        cartServices.addToBag(userId, productId, quantity)
            .then(
                res => {
                    const cartItems = cartHelper.HandleAddToCart(product, carts);
                    dispatch(success(cartItems));
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));
                    return Promise.reject(error);
                }
            );
    };

    function request() { return { type: cartConstants.ADD_REQUEST } }
    function success(cartItems) { return { type: cartConstants.ADD_SUCCESS, cartItems } }
    function failure() { return { type: cartConstants.ADD_FAILURE } }
}




function clearBag() {

    return dispatch => {
        dispatch(success());
    };

    function success() { return { type: cartConstants.CLEAR_SUCCESS } }
}



function handleQuantityChange(userId, productId, quantity, product, carts) {

    console.log(quantity);

    return dispatch => {
        dispatch(request());
        return cartServices.addToBag(userId, productId, quantity)
            .then(
                res => {
                    const cartItems = cartHelper.HandleQuantityChange(product, carts, quantity);
                    console.log(cartItems);
                    dispatch(success(cartItems));
                    return res;
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));
                    return Promise.reject(error);
                }
            );
    };

    function request() { return { type: cartConstants.ADD_REQUEST } }
    function success(cartItems) { return { type: cartConstants.ADD_SUCCESS, cartItems } }
    function failure() { return { type: cartConstants.CLEAR_FAILURE } }
}
