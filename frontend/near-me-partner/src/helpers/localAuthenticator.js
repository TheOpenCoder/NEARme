import * as LocalAuthentication from 'expo-local-authentication';
import { alertActions } from '../redux/actions/alertActions';

export const LocalAuthenticator = () => {
    return LocalAuthentication.hasHardwareAsync()
        .then(
            hasHardware => {
                if (hasHardware) {
                    return LocalAuthentication.isEnrolledAsync()
                        .then(
                            isEnrolled => {
                                if (isEnrolled) {
                                    return LocalAuthentication.authenticateAsync({ promptMessage: "Authenticate to withdraw money", disableDeviceFallback: true })
                                        .then(
                                            res => res
                                        )
                                } else {
                                    console.log("Not available")
                                }
                            },
                            error => console.log(error)
                        )
                } else {
                    console.log("hardware not available");
                }
            }
        )
}