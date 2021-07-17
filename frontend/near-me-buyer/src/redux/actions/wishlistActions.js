import { wishlistConstants } from '../constants';
import { wishlistServices } from '../../services';
import { alertActions } from './alertActions';
import { wishlistHelper } from '../../helpers';

export const wishlistActions = {
    getProductsInWishlist,
    deleteProductInWishlist,
    addToWishlist
};



function getProductsInWishlist(userId) {

    return dispatch => {
        dispatch(request());
        wishlistServices.getProductsInWishlist(userId)
            .then(
                wishlistItems => {
                    dispatch(success(wishlistItems));
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));
                    return Promise.reject(error);
                }
            );
    };

    function request() { return { type: wishlistConstants.GET_REQUEST } }
    function success(wishlistItems) { return { type: wishlistConstants.GET_SUCCESS, wishlistItems } }
    function failure() { return { type: wishlistConstants.GET_FAILURE } }
}

function deleteProductInWishlist(userId, productId, product, wishlists) {

    return dispatch => {
        dispatch(request());
        wishlistServices.deleteProductInWishlist(userId, productId)
            .then(
                res => {
                    const wishlistItems = wishlistHelper.HandleRemoveProductFromWishlist(product, wishlists);
                    dispatch(success(wishlistItems));
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));
                    return Promise.reject(error);
                }
            );
    };

    function request() { return { type: wishlistConstants.REMOVE_REQUEST } }
    function success(wishlistItems) { return { type: wishlistConstants.REMOVE_SUCCESS, wishlistItems } }
    function failure() { return { type: wishlistConstants.REMOVE_FAILURE } }
}





function addToWishlist(userId, productId, product, wishlists) {

    return dispatch => {
        dispatch(request());
        wishlistServices.addToWishlist(userId, productId)
            .then(
                res => {
                    const wishlistItems = wishlistHelper.HandleAddToWishlist(product, wishlists);
                    dispatch(success(wishlistItems));
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));
                    return Promise.reject(error);
                }
            );
    };

    function request() { return { type: wishlistConstants.ADD_REQUEST } }
    function success(wishlistItems) { return { type: wishlistConstants.ADD_SUCCESS, wishlistItems } }
    function failure() { return { type: wishlistConstants.ADD_FAILURE } }
}




