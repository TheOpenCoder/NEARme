import { authConstants } from '../constants';
import { authServices } from '../../services';
import { alertActions } from './alertActions';
import { rapydServices } from '../../services';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authActions = {
    replenish,
    register,
    login,
    logout,
    completeRegistration
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
                    return Promise.reject(error);
                }
            );
    };

    function request() { return { type: authConstants.REPLENISH_REQUEST } }
    function success(seller) { return { type: authConstants.REPLENISH_SUCCESS, seller } }
    function failure() { return { type: authConstants.REPLENISH_FAILURE } }
}


function register(sellerData, rapydCusData, ewalletData) {
    return dispatch => {
        dispatch(request());

        return authServices.registerSeller(sellerData)
            .then(
                seller => {
                    return rapydServices.createEwallet(ewalletData)
                    .then(
                        wallet_id => {
                            rapydCusData.ewallet = wallet_id;
                            return rapydServices.createCustomer(rapydCusData)
                                .then(
                                    customer_id => {
                                        return authServices.setRapydCredentials(seller.id, { customer_id, wallet_id })
                                            .then(
                                                seller => {
                                                    AsyncStorage.setItem("nearSeller", JSON.stringify(seller))
                                                        .then(() => dispatch(success(seller)));
                                                }
                                            ),
                                            error => {
                                                dispatch(failure());
                                                dispatch(alertActions.error(error.toString()));
                                                return Promise.reject(error);
                                            }
                                    }
                                ),
                                error => {
                                    dispatch(failure());
                                    dispatch(alertActions.error(error.toString()));
                                    return Promise.reject(error);
                                }
                        }
                    ),
                    error => {
                        dispatch(failure());
                        dispatch(alertActions.error(error.toString()));
                        return Promise.reject(error);
                    }
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));
                    return Promise.reject(error);
                }
            );
    };

    function request() { return { type: authConstants.REGISTER_REQUEST } }
    function success(seller) { return { type: authConstants.REGISTER_PROCESSED, seller } }
    function failure() { return { type: authConstants.REGISTER_FAILURE } }
}

function completeRegistration(sellerId, verified) {

    return dispatch => {
        dispatch(request());

        return authServices.updateKyc(sellerId, verified)
            .then(
                seller => {
                    AsyncStorage.setItem("nearSeller", JSON.stringify(seller))
                        .then(() => dispatch(success(seller)));
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));
                    return Promise.reject(error);
                }
            )
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
                    return Promise.reject(error);
                }
            );
    };

    function request() { return { type: authConstants.LOGIN_REQUEST } }
    function success(seller) { return { type: authConstants.LOGIN_SUCCESS, seller } }
    function failure() { return { type: authConstants.LOGIN_FAILURE } }
}

