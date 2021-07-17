import { authConstants } from '../constants';
import { authServices } from '../../services';
import { alertActions } from './alertActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { rapydServices } from '../../services';

export const authActions = {
    replenish,
    register,
    completeRegistration,
    login,
    logout,
    updateLendLimit
};

function replenish() {
    return dispatch => {
        dispatch(request());

        AsyncStorage.getItem("nearUser")
            .then(
                user => {
                    if (user) {
                        dispatch(success(JSON.parse(user)));
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
    function success(user) { return { type: authConstants.REPLENISH_SUCCESS, user } }
    function failure() { return { type: authConstants.REPLENISH_FAILURE } }
}


function logout() {
    return dispatch => {
        AsyncStorage.removeItem("nearUser")
            .then(() => {
                dispatch({ type: authConstants.LOGOUT })
            })
    }
}

function register(userData, rapydCusData, ewalletData) {
    return dispatch => {
        dispatch(request());

        return authServices.registerUser(userData)
            .then(
                user => {
                    return rapydServices.createEwallet(ewalletData)
                        .then(
                            wallet_id => {
                                rapydCusData.ewallet = wallet_id;
                                return rapydServices.createCustomer(rapydCusData)
                                    .then(
                                        customer_id => {
                                            return authServices.setRapydCredentials(user.id, { customer_id, wallet_id })
                                                .then(
                                                    user => {
                                                        AsyncStorage.setItem("nearUser", JSON.stringify(user))
                                                            .then(() => dispatch(success(user)));
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
    function success(user) { return { type: authConstants.REGISTER_PROCESSED, user } }
    function failure() { return { type: authConstants.REGISTER_FAILURE } }
}


function completeRegistration(userId, verified) {

    return dispatch => {
        dispatch(request());

        return authServices.updateKyc(userId, verified)
            .then(
                user => {
                    AsyncStorage.setItem("nearUser", JSON.stringify(user))
                        .then(() => dispatch(success(user)));
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));
                    return Promise.reject(error);
                }
            )
    };

    function request() { return { type: authConstants.REGISTER_REQUEST } }
    function success(user) { return { type: authConstants.REGISTER_SUCCESS, user } }
    function failure() { return { type: authConstants.REGISTER_FAILURE } }
}


function login(userCredentials) {
    return dispatch => {
        dispatch(request());

        authServices.loginUser(userCredentials)
            .then(
                user => {
                    AsyncStorage.setItem('nearUser', JSON.stringify(user))
                        .then(() => dispatch(success(user)));
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));
                    return Promise.reject(error);
                }
            );
    };

    function request() { return { type: authConstants.LOGIN_REQUEST } }
    function success(user) { return { type: authConstants.LOGIN_SUCCESS, user } }
    function failure() { return { type: authConstants.LOGIN_FAILURE } }
}



function updateLendLimit(user, limit) {
    return dispatch => {

        authServices.updateLendLimit(user.id, limit)
            .then(
                res => {
                    user.lend_limit = res.lend_limit
                    AsyncStorage.setItem('nearUser', JSON.stringify(user))
                        .then(() => dispatch({ type: authConstants.UPDATE_LEND, user }));
                },
                error => {
                    dispatch(alertActions.error(error.toString()));
                    return Promise.reject(error);
                }
            );
    };
}