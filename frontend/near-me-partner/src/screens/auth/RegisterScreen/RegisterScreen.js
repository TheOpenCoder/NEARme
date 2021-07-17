import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, Image, Pressable, Platform, AppState } from 'react-native';
import { TextInput as PaperTextInput, HelperText } from 'react-native-paper';
import { validator } from '../../../helpers';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Alerter from '../../../components/Alerter';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { deniedPermissionHelper } from '../../../helpers/deniedPermissionsHelper';
import { authActions } from '../../../redux/actions';
import LoadingScreen from '../../../components/LoadingScreen';


import Button from '../../../components/Button';
import { locationActions } from '../../../redux/actions';

const RegisterScreen = ({ navigation }) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [backToForeground, setBackToForeGround] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [image, setImage] = useState(null);
    const [deniedMediaAccess, setDeniedMediaAccess] = useState(false);
    const appState = useRef(AppState.currentState);
    const dispatch = useDispatch();
    const loading = useSelector(state => state.auth.loading);
    const userLocation = useSelector(state => state.location.userLocation);
    const userAddress = useSelector(state => state.location.userAddress);


    //handle register button click
    const handleSubmit = () => {
        setSubmitted(true);
        if(checkAllValues()){

            var data = new FormData();
            data.append('name', name);
            data.append('email', email);
            data.append('password', password);
            data.append('lat', userLocation.coords.latitude);
            data.append('long', userLocation.coords.longitude);
            data.append('location_name', userAddress[0].name);
            data.append('address', addressLine1);
            data.append('country_code', userAddress[0].isoCountryCode);
            let localUri = image.uri;
            let filename = localUri.split('/').pop();
            data.append('image', {uri: localUri, name: filename, type: 'image'});

            let rapydCusData = {
                "email": email,
                "name": name,
                "description": "NEARme delivery partner",
                "addresses": [
                    {
                        "name": name,
                        "line_1": addressLine1,
                        "city": userAddress[0].city,
                        "district": userAddress[0].district,
                        "country": userAddress[0].isoCountryCode,
                        "zip": userAddress[0].postalCode,
                    }
                ]
            }

            let ewalletData = {
                "email": email,
                "contact": {
                    "contact_type": "personal",
                    "email": email,
                    "country": userAddress[0].isoCountryCode,
                }
            }
            
            dispatch(authActions.register(data, rapydCusData, ewalletData))
            .then(
                () => {
                    navigation.navigate("KycScreen")
                },
                err => {
                    console.log(err);
                }
            )
        }

    }

    const checkAllValues = () => {
        if (validator.validateEmail(true, email) && password && name && userAddress && image && addressLine1) {
            return true;
        }
        return false;
    }
    



    const handleImageClick = () => {
        if (deniedMediaAccess) {
            deniedPermissionHelper()
        } else {
            if (Platform.OS !== 'web') {
                ImagePicker.requestMediaLibraryPermissionsAsync()
                    .then(({ status }) => {
                        if (status === "denied") {
                            setDeniedMediaAccess(true);
                        } else {
                            pickImage()
                        }
                    })
            }
        }
    }

    //handle pickImage
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result);
        }
    };


     //check app visibility
     useEffect(() => {
        AppState.addEventListener('change', _handleAppStateChange);

        return () => {
            AppState.removeEventListener('change', _handleAppStateChange);
        };
    }, []);

     //handle app visibility change
     const _handleAppStateChange = (nextAppState) => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            setBackToForeGround(true);
        }

        appState.current = nextAppState;
    };

        //get user location
        useEffect(() => {
            dispatch(locationActions.getUserLocation());
        }, []);


           //gets user location after permission is given
    if (userLocation && userLocation.permission === "denied") {
        if (backToForeground) {
            dispatch(locationActions.getUserLocation());
        }
    }


    if (userLocation && userLocation.permission === "denied") {
        return (
            <View style={styles.deniedContainer}>
                <Text style={styles.deniedText}>Location access is needed to register</Text>
                <Button text="Provide Access" onPress={() => deniedPermissionHelper()} />
            </View>
        )
    }

    if(loading){
        return (
        <LoadingScreen />
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#E5E5E5" }}>
            <KeyboardAwareScrollView style={{ paddingHorizontal: 20, paddingTop: 80 }} showsVerticalScrollIndicator={false}>
                <View style={{ marginVertical: 20 }}>
                    <Image source={require('../../../../assets/images/Register.png')} style={styles.logoImage} />
                    <Text style={styles.subHeading}>Hey, Welcome to near delivery app</Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <View style={{ alignItems: "center" }}>
                        <Pressable onPress={() => handleImageClick()}>
                            {image ? (
                                <Image source={{ uri: image.uri }} resizeMode="contain" style={styles.profileImage} />
                            ) : (
                                <View style={styles.imageClickableContainer}>
                                    <Text
                                        style={{ textAlign: "center" }}>
                                        {deniedMediaAccess ? "Need media access to set profile picture" : "Click here to pick image"}
                                    </Text>
                                    {submitted && !image && (
                                        <HelperText type="error">
                                        Image is required
                                    </HelperText>
                                    )}
                                </View>
                            )}
                        </Pressable>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <PaperTextInput
                            label="Enter Full Name"
                            value={name}
                            textContentType="name"
                            onChangeText={setName}
                            selectionColor="#464A29"
                            underlineColor="#BBBBBB"
                            keyboardAppearance="dark"
                            keyboardType="default"
                            clearButtonMode="while-editing"
                            returnKeyType="next"
                            autoCompleteType="name"
                            error={submitted && !name}
                        />

                        <HelperText type="error" visible={submitted && !name}>
                            Name is required!
                        </HelperText>
                    </View>

                    <View>
                        <PaperTextInput
                            label="Enter Email"
                            value={email}
                            textContentType="emailAddress"
                            onChangeText={setEmail}
                            selectionColor="#464A29"
                            underlineColor="#BBBBBB"
                            keyboardAppearance="dark"
                            keyboardType="email-address"
                            clearButtonMode="while-editing"
                            returnKeyType="next"
                            autoCompleteType="email"
                            error={!validator.validateEmail(submitted, email)}
                        />

                        <HelperText type="error" visible={!validator.validateEmail(submitted, email)}>
                            Email is required!
                        </HelperText>
                    </View>

                    <View>
                        <PaperTextInput
                            label="Enter password"
                            value={password}
                            onChangeText={setPassword}
                            selectionColor="#464A29"
                            underlineColor="#BBBBBB"
                            keyboardAppearance="dark"
                            textContentType="newPassword"
                            clearButtonMode="while-editing"
                            returnKeyType="next"
                            autoCompleteType="password"
                            passwordRules="minlength: 12; required: lower; required: upper; required: digit;"
                            secureTextEntry={true}
                            error={submitted && !password}
                        />

                        <HelperText type="error" visible={submitted && !password}>
                            Password is required!
                        </HelperText>
                    </View>

                    <View>
                        <PaperTextInput
                            label="Enter Door no/ Flat no"
                            value={addressLine1}
                            textContentType="streetAddressLine1"
                            onChangeText={setAddressLine1}
                            selectionColor="#464A29"
                            underlineColor="#BBBBBB"
                            keyboardAppearance="dark"
                            keyboardType="default"
                            clearButtonMode="while-editing"
                            returnKeyType="done"
                            autoCompleteType="street-address"
                            error={submitted && !addressLine1}
                        />

                        <HelperText type="error" visible={submitted && !addressLine1}>
                        Door / Flat No is required!
                        </HelperText>
                    </View>

                    <View>
                        <PaperTextInput
                            label={userAddress && "Neighbourhood Name"}
                            value={userAddress ? userAddress[0].name : "Neighbourhood Name"}
                            disabled
                        />
                    </View>


                </View>

                <View style={styles.submitButtonContainer}>
                    <Button text="Register" width="100%" style={{ marginVertical: 20 }} onPress={() => handleSubmit()} />
                </View>
                <Text style={styles.footer}>
                    <Text>Existing user? </Text>
                    <Text style={{ fontFamily: "MontserratSemiBold", color: "black" }} onPress={() => navigation.replace("LoginScreen")}> Login</Text>
                </Text>
            </KeyboardAwareScrollView>
            <Alerter />
        </View>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    logoImage: {
        width: 300,
        resizeMode: "contain",
        height: 100
    },
    subHeading: {
        fontSize: 18,
        color: "#8C8C8C",
        fontFamily: "IBMMedium"
    },
    imageClickableContainer: {
        backgroundColor: "#F5F5F5",
        width: 140,
        height: 140,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        padding: 10
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 50
    },
    submitButtonContainer: {
        width: '100%',
        alignItems: "center",
        flex: 1,
        justifyContent: "flex-end"
    },
    footer: {
        fontSize: 18,
        color: "#8C8C8C",
        marginTop: 18,
        fontFamily: "IBMMedium",
        marginBottom: 200
    },
    deniedContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E5E5E5"
    },
    deniedText: {
        fontSize: 24,
        textAlign: "center",
        marginVertical: 20
    }
})
