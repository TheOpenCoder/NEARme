import React, { useState } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native';
import { TextInput as PaperTextInput, HelperText } from 'react-native-paper';
import { validator } from '../../../helpers';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Alerter from '../../../components/Alerter';
import { useDispatch, useSelector } from 'react-redux';
import LoadingScreen from '../../../components/LoadingScreen';
import { authActions } from '../../../redux/actions';

import Button from '../../../components/Button';

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const loading = useSelector(state => state.auth.loading);
    const dispatch = useDispatch();

    const handleSubmit = () => {
        setSubmitted(true);
        if(checkAllValues()){
            dispatch(authActions.login({ "email": email, "password": password }));
        }
    }

    const checkAllValues = () => {
        if (validator.validateEmail(true, email) && validator.validateNotNull(true, password)) {
            return true;
        }
        return false;
    }

    if(loading){
        return <LoadingScreen />
    }


    return (
        <View style={{ flex: 1, backgroundColor: "#E5E5E5" }}>
            <KeyboardAwareScrollView style={{ paddingHorizontal: 20, paddingTop: 80 }} showsVerticalScrollIndicator={false}>
                <View style={{ marginVertical: 20 }}>
                    <Image source={require('../../../../assets/images/Login.png')} style={{ width: 200, resizeMode: "contain", height: 100 }} />
                    <Text style={{ fontSize: 18, color: "#8C8C8C", fontFamily: "IBMMedium" }}>Hey, Welcome back</Text>
                </View>
                <View style={{ marginVertical: 30 }}>
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
                            textContentType="emailAddress"
                            error={!validator.validateEmail(submitted, email)}
                        />


                        <HelperText type="error" visible={!validator.validateEmail(submitted, email)}>
                            Invalid Email!
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
                            textContentType="password"
                            clearButtonMode="while-editing"
                            returnKeyType="done"
                            autoCompleteType="password"
                            secureTextEntry={true}
                            error={!validator.validateNotNull(submitted, password)}
                        />

                        <HelperText type="error" visible={!validator.validateNotNull(submitted, password)}>
                            Password is required!
                        </HelperText>
                    </View>

                </View>

                <View style={{ width: '100%', alignItems: "center", flex: 1, justifyContent: "flex-end" }}>
                    <Button text="Login" width="100%" style={{ marginVertical: 20 }} onPress={() => handleSubmit()} />
                </View>
                <Text style={{ fontSize: 18, color: "#8C8C8C", marginTop: 18, fontFamily: "IBMMedium" }}>
                    <Text>New here? </Text>
                    <Text style={{ fontFamily: "MontserratSemiBold", color: "black" }} onPress={() => navigation.replace("RegisterScreen")}> Register</Text>
                </Text>
            </KeyboardAwareScrollView>
            <Alerter />
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({})
