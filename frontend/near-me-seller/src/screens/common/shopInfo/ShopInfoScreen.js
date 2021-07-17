import React, { useState, useEffect, useRef } from 'react'
import { View, Platform, StyleSheet, Pressable, Text, Image, AppState } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from '../../../components/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { validator } from '../../../helpers'
import { TextInput as PaperTextInput, HelperText } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { deniedPermissionHelper } from '../../../helpers/deniedPermissionsHelper';
import RNPickerSelect from 'react-native-picker-select';
import { useDispatch, useSelector } from 'react-redux';
import LoadingScreen from '../../../components/LoadingScreen';
import { useNavigation } from '@react-navigation/native';


import { locationActions, authActions } from '../../../redux/actions';

const ShopInfoScreen = (props) => {


    const seller = useSelector(state => state.auth.seller);
    const navigation = useNavigation();
    const [openingTime, setOpeningTime] = useState(new Date(`July 1, 2020 ${props.edit ? seller.open_time : "09:00:00"}`));
    const [closingTime, setClosingTime] = useState(new Date(`July 1, 2020 ${props.edit ? seller.close_time : "22:00:00"}`));
    const [showOpeningTimer, setShowOpeningTimer] = useState(false);
    const [showClosingTimer, setShowClosingTimer] = useState(false);
    const [shopName, setShopName] = useState(props.edit && seller.name);
    const [image, setImage] = useState(props.edit && seller.image);
    const [submitted, setSubmitted] = useState(false);
    const [stateLoading, setStateLoading] = useState(false)
    const [deniedMediaAccess, setDeniedMediaAccess] = useState(false);
    const [category, setCategory] = useState("");
    const [backToForeground, setBackToForeGround] = useState(false);
    const appState = useRef(AppState.currentState);
    const dispatch = useDispatch();
    const loading = useSelector(state => state.auth.loading);
    const sellerLocation = useSelector(state => state.location.sellerLocation);
    const sellerAddress = useSelector(state => state.location.sellerAddress);


    //handles android time picker
    const onOpeningChange = (event, selectedDate) => {
        const currentDate = selectedDate || openingTime;
        setOpeningTime(currentDate);
    };

    const onClosingChange = (event, selectedDate) => {
        const currentDate = selectedDate || closingTime;
        setClosingTime(currentDate);
    };


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
            aspect: [16, 9],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };


    const handlePageEdit = () => {
        setSubmitted(true);
        if (checkAllValues()) {
            setStateLoading(true);
            var data = new FormData();
            data.append('name', shopName);
            data.append('email', props.email);
            data.append('password', props.password);
            data.append('category', category);
            data.append('lat', sellerLocation.coords.latitude);
            data.append('long', sellerLocation.coords.longitude);
            data.append('location_name', sellerAddress[0].name);
            data.append('address', props.addressLine1);
            data.append('country_code', sellerAddress[0].isoCountryCode);
            data.append('open_time', openingTime.getHours() + ":" + openingTime.getMinutes());
            data.append('close_time', closingTime.getHours() + ":" + closingTime.getMinutes());
            let filename = image.split('/').pop();
            data.append('image', { uri: image, name: filename, type: 'image' });

            let rapydCusData = {
                "email": props.email,
                "name": shopName,
                "description": "NEARme seller",
                "addresses": [
                    {
                        "name": shopName,
                        "line_1": props.addressLine1,
                        "city": sellerAddress[0].city,
                        "district": sellerAddress[0].district,
                        "country": sellerAddress[0].isoCountryCode,
                        "zip": sellerAddress[0].postalCode,
                    }
                ]
            }

            let ewalletData = {
                "email": props.email,
                "contact": {
                    "contact_type": "personal",
                    "email": props.email,
                    "country": sellerAddress[0].isoCountryCode,
                }
            }


            dispatch(authActions.register(data, rapydCusData, ewalletData))
            .then(
                () => {
                    setStateLoading(false);
                    navigation.navigate("KycScreen")
                },
                err => {
                    console.log(err);
                }
            )
        }
    }

    const checkAllValues = () => {
        if (shopName && category && image) {
            return true;
        }
        return false;
    }

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

        //get seller location
        useEffect(() => {
            dispatch(locationActions.getSellerLocation());
        }, []);


           //gets seller location after permission is given
    if (sellerLocation && sellerLocation.permission === "denied") {
        if (backToForeground) {
            dispatch(locationActions.getSellerLocation());
        }
    }


    if (sellerLocation && sellerLocation.permission === "denied") {
        return (
            <View style={styles.deniedContainer}>
                <Text style={styles.deniedText}>Location access is needed to register</Text>
                <Button text="Provide Access" onPress={() => deniedPermissionHelper()} />
            </View>
        )
    }

    if(loading || stateLoading){
        return <LoadingScreen />
    }


    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: "#E5E5E5", paddingTop: 20 }}
            showsVerticalScrollIndicator={false}
        >
            <View style={{ paddingHorizontal: 20, marginBottom: 70 }}>
                <View>
                    <PaperTextInput
                        label="Enter shop name"
                        value={shopName}
                        onChangeText={setShopName}
                        selectionColor="#464A29"
                        underlineColor="#BBBBBB"
                        keyboardAppearance="dark"
                        error={!validator.validateNotNull(submitted, shopName)}
                    />
                    <HelperText type="error" visible={!validator.validateNotNull(submitted, shopName)}>
                        shop name is required
                    </HelperText>
                </View>
                <RNPickerSelect
                    onValueChange={setCategory}
                    placeholder={{
                        label: 'Select your shop category',
                        value: null,
                        color: "black"
                    }}
                    style={Platform.OS === 'ios' ? { "inputIOS": styles.inputIOS } : { "inputAndroid": styles.inputAndroid }}
                    items={[
                        { label: 'Groceries', value: 'groceries' },
                        { label: 'Food', value: 'food' },
                        { label: 'Medicine', value: 'medicine' },
                        { label: 'Electronics', value: 'electronics' },
                        { label: 'Sports', value: 'sports' },
                    ]}
                />
                <HelperText type="error" visible={!validator.validateNotNull(submitted, category)}>category is needed</HelperText>
                <View>
                    {Platform.OS === 'android' &&
                        <>
                            <Button onPress={() => setShowOpeningTimer(true)} text="Pick Opening Time" style={{ marginBottom: 10 }} />
                            <Button onPress={() => setShowClosingTimer(true)} text="Pick Closing Time" />
                        </>
                    }
                </View>

                {(showOpeningTimer || Platform.OS === 'ios') && (
                    <View style={{ justifyContent: "flex-end", flex: 1, position: "relative" }}>
                        <Text style={{ fontSize: 18, position: "absolute", bottom: 16 }}>Opening Time</Text>
                        <DateTimePicker
                            value={openingTime}
                            mode="time"
                            is24Hour={true}
                            display={Platform.OS === 'ios' ? "inline" : "spinner"}
                            themeVariant="dark"
                            onChange={onOpeningChange}
                        />
                    </View>
                )}

                {(showClosingTimer || Platform.OS === 'ios') && (
                    <View style={{ justifyContent: "flex-end", flex: 1, position: "relative" }}>
                        <Text style={{ fontSize: 18, position: "absolute", bottom: 16 }}>Closing Time</Text>
                        <DateTimePicker
                            value={closingTime}
                            mode="time"
                            is24Hour={true}
                            display={Platform.OS === 'ios' ? "inline" : "spinner"}
                            themeVariant="dark"
                            onChange={onClosingChange}
                        />
                    </View>
                )}
                <Pressable onPress={() => handleImageClick()}>
                    {image ? (
                        <Image source={{ uri: image }} resizeMode="cover" style={{ width: '98%', height: 180, borderRadius: 10, marginVertical: 20 }} />
                    ) : (
                        <View style={{ backgroundColor: "#5A5A5A", height: 180, borderRadius: 10, alignItems: "center", justifyContent: "center", padding: 10, marginVertical: 20 }}>
                            <Text style={{ color: "white" }}>{deniedMediaAccess ? "Need media access to set profile picture" : "pick image for store"}</Text>
                            {submitted && !image && (
                                <HelperText type="error">
                                    Image is required
                                </HelperText>
                            )}
                        </View>
                    )}

                </Pressable>
                <Button text="Save changes" onPress={() => handlePageEdit()} />
            </View>
        </KeyboardAwareScrollView>



    )
}

export default ShopInfoScreen

const styles = StyleSheet.create({
    inputIOS: {
        fontSize: 20,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: '#ADADAD',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        marginVertical: 10
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderColor: '#ADADAD',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
    },
})
