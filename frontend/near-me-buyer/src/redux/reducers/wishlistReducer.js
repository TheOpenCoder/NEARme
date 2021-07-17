import { wishlistConstants } from '../constants';

export function wishlist(state = {}, action) {
    switch (action.type) {
        case wishlistConstants.GET_REQUEST:
            return {
                ...state,
                loading: true
            };
        case wishlistConstants.GET_SUCCESS:
            return {
                ...state,
                loading: false,
                wishlistItems: action.wishlistItems
            };
        case wishlistConstants.GET_FAILURE:
            return {
                ...state,
                loading: false
            };
        case wishlistConstants.ADD_REQUEST:
            return {
                ...state,
                loading: true
            };
        case wishlistConstants.ADD_SUCCESS:
            return {
                ...state,
                loading: false,
                wishlistItems: action.wishlistItems
            };
        case wishlistConstants.ADD_FAILURE:
            return {
                ...state,
                loading: false
            };
        case wishlistConstants.REMOVE_REQUEST:
            return {
                ...state,
                loading: true
            };
        case wishlistConstants.REMOVE_SUCCESS:
            return {
                ...state,
                loading: false,
                wishlistItems: action.wishlistItems
            };
        case wishlistConstants.REMOVE_FAILURE:
            return {
                ...state,
                loading: false
            };
        default:
            return state
    }
}