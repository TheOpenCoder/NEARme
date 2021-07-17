import { orderServices } from '../../services';
import { alertActions } from './alertActions';
import { orderConstants } from '../constants';

export const orderActions = {
    getOngoingOrders,
    getCompletedOrders
};


function getOngoingOrders(sellerId) {
    return dispatch => {
        dispatch(request());

        orderServices.getOngoingOrders(sellerId)
            .then(
                ongoingOrders => {
                    dispatch(success(ongoingOrders));
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));
                    return Promise.reject(error);
                }
            );
    };

    function request() { return { type: orderConstants.GET_ONGOING_ORDER_REQUEST } }
    function success(ongoingOrders) { return { type: orderConstants.GET_ONGOING_ORDER_SUCCESS, ongoingOrders } }
    function failure() { return { type: orderConstants.GET_ONGOING_ORDER_FAILURE } }
}


function getCompletedOrders(sellerId) {
    return dispatch => {
        dispatch(request());

        orderServices.getCompletedOrders(sellerId)
            .then(
                completedOrders => {
                    dispatch(success(completedOrders));
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));
                    return Promise.reject(error);
                }
            );
    };

    function request() { return { type: orderConstants.GET_COMPLETED_ORDER_REQUEST } }
    function success(completedOrders) { return { type: orderConstants.GET_COMPLETED_ORDER_SUCCESS, completedOrders } }
    function failure() { return { type: orderConstants.GET_COMPLETED_ORDER_FAILURE } }
}

