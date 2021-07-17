import { authConstants } from '../constants';

export function auth(state = {}, action) {
    switch (action.type) {
        case authConstants.REPLENISH_REQUEST:
            return {
                ...state,
                loading: true
            };
        case authConstants.REPLENISH_SUCCESS:
            return {
                ...state,
                loading: false,
                loggedIn: true,
                user: action.user
            };
        case authConstants.REPLENISH_FAILURE:
            return {
                ...state,
                loading: false
            };
        case authConstants.LOGIN_REQUEST:
            return {
                ...state,
                loading: true
            };
        case authConstants.LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                loggedIn: true,
                user: action.user
            };
        case authConstants.LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
            };
        case authConstants.LOGOUT:
            return {
                ...state,
                loggedIn: false
            };
        case authConstants.REGISTER_REQUEST:
            return {
                ...state,
                loading: true
            };
        case authConstants.REGISTER_PROCESSED:
            return {
                ...state,
                loading: false,
                user: action.user
            };
        case authConstants.REGISTER_SUCCESS:
            return {
                ...state,
                loading: false,
                loggedIn: true,
                user: action.user
            };
        case authConstants.REGISTER_FAILURE:
            return {
                ...state,
                loading: false
            };
        case authConstants.UPDATE_LEND:
            return {
                ...state,
                user: action.user
            };
        default:
            return state
    }
}