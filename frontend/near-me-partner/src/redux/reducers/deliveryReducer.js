import { deliveryConstants } from "../constants";

export function delivery(state = {}, action) {
    switch (action.type) {
        case deliveryConstants.GET_DELIVERY_REQUEST:
            return {
                ...state,
                loading: true
            };
        case deliveryConstants.GET_DELIVERY_SUCCESS:
            return {
                ...state,
                loading: false,
                deliveries: action.deliveries
            };
        case deliveryConstants.GET_DELIVERY_FAILURE:
            return {
                ...state,
                loading: false
            };
        default:
            return state
    }
}