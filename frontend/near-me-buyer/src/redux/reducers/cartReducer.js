import { cartConstants } from '../constants';

export function cart(state = {}, action) {
    switch (action.type) {
        case cartConstants.GET_REQUEST:
            return {
                ...state,
                loading: true
            };
        case cartConstants.GET_SUCCESS:
            return {
                ...state,
                loading: false,
                cartItems: action.cartItems
            };
        case cartConstants.GET_FAILURE:
            return {
                ...state,
                loading: false
            };
        case cartConstants.ADD_REQUEST:
            return {
                ...state,
                loading: true
            };
        case cartConstants.ADD_SUCCESS:
            return {
                ...state,
                loading: false,
                cartItems: action.cartItems
            };
        case cartConstants.ADD_FAILURE:
            return {
                ...state,
                loading: false
            };
        case cartConstants.REMOVE_REQUEST:
            return {
                ...state,
                loading: true
            };
        case cartConstants.REMOVE_SUCCESS:
            return {
                ...state,
                loading: false,
                cartItems: action.cartItems
            };
        case cartConstants.REMOVE_FAILURE:
            return {
                ...state,
                loading: false
            };
        case cartConstants.CLEAR_REQUEST:
            return {
                ...state,
                loading: true
            };
        case cartConstants.CLEAR_SUCCESS:
            return {
                ...state,
                loading: false,
                cartItems: []
            };
        case cartConstants.CLEAR_FAILURE:
            return {
                ...state,
                loading: false
            };
        default:
            return state
    }
}