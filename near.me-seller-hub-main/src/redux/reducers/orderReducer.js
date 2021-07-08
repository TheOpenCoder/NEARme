import { orderConstants } from "../constants";

export function orders(state = {}, action) {
    switch (action.type) {
        case orderConstants.GET_ONGOING_ORDER_REQUEST:
            return {
                ...state,
                loading: true
            };
        case orderConstants.GET_ONGOING_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                ongoingOrders: action.ongoingOrders
            };
        case orderConstants.GET_ONGOING_ORDER_FAILURE:
            return {
                ...state,
                loading: false
            };
        default:
            return state
    }
}