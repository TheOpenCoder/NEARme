import { deliveryConstants } from '../constants';
import { deliveryServices } from '../../services';
import { alertActions } from './alertActions';



export const deliveryActions = {
    getDeliveryRequests
};


function getDeliveryRequests(partnerId) {
    return dispatch => {
        dispatch(request());

        deliveryServices.getDeliveryRequests(partnerId)
            .then(
                deliveries => {
                    dispatch(success(deliveries));
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));
                    return Promise.reject(error);
                }
            );
    };

    function request() { return { type: deliveryConstants.GET_DELIVERY_REQUEST } }
    function success(deliveries) { return { type: deliveryConstants.GET_DELIVERY_SUCCESS, deliveries } }
    function failure() { return { type: deliveryConstants.GET_DELIVERY_FAILURE } }
}

