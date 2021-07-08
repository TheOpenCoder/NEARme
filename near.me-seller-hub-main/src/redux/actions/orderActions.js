import { orderServices } from '../../services';
import { alertActions } from './alertActions';
import { orderConstants } from '../constants';

export const orderActions = {
    getOngoingOrders,
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
                }
            );
    };

    function request() { return { type: orderConstants.GET_ONGOING_ORDER_REQUEST } }
    function success(ongoingOrders) { return { type: orderConstants.GET_ONGOING_ORDER_SUCCESS, ongoingOrders } }
    function failure() { return { type: orderConstants.GET_ONGOING_ORDER_FAILURE } }
}

