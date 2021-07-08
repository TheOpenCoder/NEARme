import { locationConstants } from "../constants";

export function location(state = {}, action) {
    switch (action.type) {
        case locationConstants.LOCATION_REQUEST:
            return {
                ...state,
                loading: true
            };
        case locationConstants.LOCATION_SUCCESS:
            return {
                ...state,
                loading: false,
                sellerLocation: action.sellerLocation
            };
        case locationConstants.LOCATION_FAILURE:
            return {
                ...state,
                loading: false,
                sellerLocation: null
            };
        case locationConstants.GET_ADDRESS_REQUEST:
            return {
                ...state,
                loading: false
            };
        case locationConstants.GET_ADDRESS_SUCCESS:
            return {
                ...state,
                loading: false,
                sellerAddress: action.address
            };
        case locationConstants.GET_ADDRESS_FAILURE:
            return {
                ...state,
                loading: false,
                sellerAddress: null
            };
        default:
            return state
    }
}