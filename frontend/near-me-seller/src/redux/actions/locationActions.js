import { alertActions } from './alertActions';
import { locationConstants } from '../constants';
import { locationServices } from '../../services';
import { getForegroundPermissionsAsync, requestForegroundPermissionsAsync } from 'expo-location';



export const locationActions = {
    getSellerLocation
};


// Tries to get seller last known location, if it is null, it tries to get seller current location
function getSellerLocation() {
    return dispatch => {
        dispatch(request());

        getForegroundPermissionsAsync()
            .then(({ status }) => {
                if (status === 'granted') {
                    getLocation(dispatch)
                } else if (status === 'undetermined') {
                    requestForegroundPermissionsAsync()
                        .then(({ status }) => {
                            if (status === 'granted') {
                                getLocation(dispatch)
                            } else {
                                dispatch(success({ permission: "denied", coords: null }))
                            }
                        })
                } else {
                    dispatch(success({ permission: "denied", coords: null }))
                }
            })
    };


    function getLocation(dispatch) {
        locationServices.getLastKnownLocation()
            .then(
                res => {
                    if (res) {
                        dispatch(success({ permission: "granted", coords: res.coords }));
                        getSellerAddress({ latitude: res.coords.latitude, longitude: res.coords.longitude }, dispatch)
                    } else {
                        locationServices.getCurrentLocation()
                            .then(
                                location => {
                                    dispatch(success({ permission: "granted", coords: location.coords }));
                                    getSellerAddress({ latitude: location.coords.latitude, longitude: location.coords.longitude }, dispatch)
                                },
                                error => {
                                    dispatch(failure());
                                    dispatch(alertActions.error(error.toString()));
                                    return Promise.reject(error);
                                }
                            )
                    }
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));
                    return Promise.reject(error);
                }
            );
    }


    function request() { return { type: locationConstants.LOCATION_REQUEST } }
    function success(sellerLocation) { return { type: locationConstants.LOCATION_SUCCESS, sellerLocation } }
    function failure() { return { type: locationConstants.LOCATION_FAILURE } }
}


function getSellerAddress(location, dispatch) {

    dispatch(request());

    locationServices.reverseGeoCode(location)
        .then(
            res => {
                dispatch(success(res));
            },
            error => {
                dispatch(failure());
                dispatch(alertActions.error(error.toString()));
                return Promise.reject(error);
            }
        )

    function request() { return { type: locationConstants.GET_ADDRESS_REQUEST } }
    function success(address) { return { type: locationConstants.GET_ADDRESS_SUCCESS, address } }
    function failure() { return { type: locationConstants.GET_ADDRESS_FAILURE } }
}