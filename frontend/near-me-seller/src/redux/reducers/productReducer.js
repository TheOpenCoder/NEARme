import { productConstants } from "../constants";

export function product(state = {}, action) {
    switch (action.type) {
        case productConstants.GET_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true
            };
        case productConstants.GET_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                sellerProducts: action.sellerProducts
            };
        case productConstants.GET_PRODUCT_FAILURE:
            return {
                ...state,
                loading: false,
                sellerProducts: null
            };
        default:
            return state
    }
}