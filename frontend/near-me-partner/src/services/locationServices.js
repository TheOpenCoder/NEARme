import * as Location from 'expo-location';


export const locationServices = {
    getCurrentLocation,
    getLastKnownLocation,
    reverseGeoCode
};

function getCurrentLocation() {
    return Location.getCurrentPositionAsync({ accuracy: 6 })
        .then(location => {
            return location;
        })
        .catch(err => {
            return Promise.reject(err.response.data);
        })
}


function getLastKnownLocation() {
    return Location.getLastKnownPositionAsync({ maxAge: 10000, requiredAccuracy: 8 })
        .then(res => {
            return res;
        })
        .catch(err => {
            return Promise.reject(err.response.data);
        })
}

function reverseGeoCode(location) {
    return Location.reverseGeocodeAsync(location)
        .then(res => {
            return res;
        })
        .catch(err => {
            return Promise.reject(err.response.data);
        })
}