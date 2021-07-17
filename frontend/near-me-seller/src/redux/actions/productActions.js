import { productConstants } from '../constants';
import { productServices } from '../../services';
import { alertActions } from './alertActions';

export const productActions = {
    getSellerProducts,
};


function getSellerProducts(sellerId) {
    return dispatch => {
        dispatch(request());

        productServices.getSellerProducts(sellerId)
            .then(
                sellerProducts => {
                    dispatch(success(sellerProducts));
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));
                    return Promise.reject(error);
                }
            );
    };

    function request() { return { type: productConstants.GET_PRODUCT_REQUEST } }
    function success(sellerProducts) { return { type: productConstants.GET_PRODUCT_SUCCESS, sellerProducts } }
    function failure() { return { type: productConstants.GET_PRODUCT_FAILURE } }
}

