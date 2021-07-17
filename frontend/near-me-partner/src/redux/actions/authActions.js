import { authConstants } from '../constants';
import { authServices } from '../../services';
import { alertActions } from './alertActions';
import { rapydServices } from '../../services';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const authActions = {
    replenish,
    login,
    logout,
    register,
    completeRegistration
};

function replenish() {
    return dispatch => {
        dispatch(request());

        AsyncStorage.getItem("nearPartner")
            .then(
                partner => {
                    if (partner) {
                        dispatch(success(JSON.parse(partner)));
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
    function success(partner) { return { type: authConstants.REPLENISH_SUCCESS, partner } }
    function failure() { return { type: authConstants.REPLENISH_FAILURE } }
}

function register(partnerData, rapydCusData, ewalletData) {
    return dispatch => {
        dispatch(request());

        return authServices.registerPartner(partnerData)
            .then(
                partner => {
                    return rapydServices.createEwallet(ewalletData)
                        .then(
                            wallet_id => {
                                rapydCusData.ewallet = wallet_id;
                                return rapydServices.createCustomer(rapydCusData)
                                    .then(
                                        customer_id => {
                                            return authServices.setRapydCredentials(partner.id, { customer_id, wallet_id })
                                                .then(
                                                    partner => {
                                                        AsyncStorage.setItem("nearPartner", JSON.stringify(partner))
                                                            .then(() => dispatch(success(partner)));
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
    function success(partner) { return { type: authConstants.REGISTER_PROCESSED, partner } }
    function failure() { return { type: authConstants.REGISTER_FAILURE } }
}

function completeRegistration(partnerId, verified) {

    return dispatch => {
        dispatch(request());

        return authServices.updateKyc(partnerId, verified)
            .then(
                partner => {
                    AsyncStorage.setItem("nearPartner", JSON.stringify(partner))
                        .then(() => dispatch(success(partner)));
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));
                    return Promise.reject(error);
                }
            )
    };

    function request() { return { type: authConstants.REGISTER_REQUEST } }
    function success(partner) { return { type: authConstants.REGISTER_SUCCESS, partner } }
    function failure() { return { type: authConstants.REGISTER_FAILURE } }
}

function logout() {
    return dispatch => {
        AsyncStorage.removeItem("nearPartner")
            .then(() => {
                dispatch({ type: authConstants.LOGOUT })
            })
    }
}


function login(partnerCredentials) {
    return dispatch => {
        dispatch(request());

        authServices.loginPartner(partnerCredentials)
            .then(
                partner => {
                    AsyncStorage.setItem('nearPartner', JSON.stringify(partner))
                        .then(() => dispatch(success(partner)));
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));
                    return Promise.reject(error);
                }
            );
    };

    function request() { return { type: authConstants.LOGIN_REQUEST } }
    function success(partner) { return { type: authConstants.LOGIN_SUCCESS, partner } }
    function failure() { return { type: authConstants.LOGIN_FAILURE } }
}

