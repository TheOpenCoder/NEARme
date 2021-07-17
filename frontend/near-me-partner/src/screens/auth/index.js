import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import HeaderTitle from '../../components/title/HeaderTitle';

const Stack = createStackNavigator();


//import Screens
import LandingScreen from './landingScreen/LandingScreen';
import LoginScreen from './loginScreen/LoginScreen';
import RegisterScreen from './RegisterScreen/RegisterScreen';
import KycScreen from './kycScreen/KycScreen';
const Auth = () => {
    return (
        <Stack.Navigator
            headerMode="none"
        >
            <Stack.Screen
                name="LandingScreen"
                component={LandingScreen}
            />
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
            />
            <Stack.Screen
                name="RegisterScreen"
                component={RegisterScreen}
            />
             <Stack.Screen
                name="KycScreen"
                component={KycScreen}
            />

        </Stack.Navigator>
    )
}

export default Auth
