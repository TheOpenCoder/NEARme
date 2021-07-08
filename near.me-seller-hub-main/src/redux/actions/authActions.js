import { authConstants } from '../constants';
import { authServices } from '../../services';
import { alertActions } from './alertActions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authActions = {
    replenish,
    register,
    login,
    logout
};

function replenish() {
    return dispatch => {
        dispatch(request());

        AsyncStorage.getItem("nearSeller")
            .then(
                seller => {
                    if (seller) {
                        dispatch(success(JSON.parse(seller)));
                    } else {
                        dispatch(failure());
                    }
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: authConstants.REPLENISH_REQUEST } }
    function success(seller) { return { type: authConstants.REPLENISH_SUCCESS, seller } }
    function failure() { return { type: authConstants.REPLENISH_FAILURE } }
}


function register(sellerData) {
    return dispatch => {
        dispatch(request());

        authServices.registerSeller(sellerData)
            .then(
                seller => {
                    AsyncStorage.setItem('nearSeller', JSON.stringify(seller))
                    .then(() => dispatch(success(seller)));
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: authConstants.REGISTER_REQUEST } }
    function success(seller) { return { type: authConstants.REGISTER_SUCCESS, seller } }
    function failure() { return { type: authConstants.REGISTER_FAILURE } }
}

function logout() {
    return dispatch => {
        AsyncStorage.removeItem("nearSeller")
         .then(() =>  {
             dispatch({type: authConstants.LOGOUT})
            })
    }
}


function login(sellerCredentials) {
    return dispatch => {
        dispatch(request());

        authServices.loginSeller(sellerCredentials)
            .then(
                seller => {
                    AsyncStorage.setItem('nearSeller', JSON.stringify(seller))
                    .then(() => dispatch(success(seller)));
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: authConstants.LOGIN_REQUEST } }
    function success(seller) { return { type: authConstants.LOGIN_SUCCESS, seller } }
    function failure() { return { type: authConstants.LOGIN_FAILURE } }
}

