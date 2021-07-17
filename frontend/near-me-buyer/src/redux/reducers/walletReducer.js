import { walletConstants } from "../constants";

export function wallet(state = {}, action) {
    switch (action.type) {
        case walletConstants.GET_WALLET_REQUEST:
            return {
                ...state,
                loading: true
            };
        case walletConstants.GET_WALLET_SUCCESS:
            return {
                ...state,
                loading: false,
                walletDetails: action.walletDetails
            };
        case walletConstants.GET_WALLET_FAILURE:
            return {
                ...state,
                loading: false,
            };
        default:
            return state
    }
}