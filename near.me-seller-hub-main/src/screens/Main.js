import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../redux/actions';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';

const Tab = createBottomTabNavigator();

//import Screens
import Profile from './Profile';
import OngoingOrders from './ongoingOrders';
import CompletedOrders from './completedOrders';
import Home from './home';
import Auth from './auth';


const Main = () => {

    const loggedIn = useSelector(state => state.auth.loggedIn);
    const loading = useSelector(state => state.auth.loading);
    const dispatch = useDispatch();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        dispatch(authActions.replenish());
    }, []);

    const loadAssetsAsync = async () => {
        const imageAssets = cacheImages([
            require('../../assets/images/nearLogo.png'),
            require('../../assets/images/Register.png'),
            require('../../assets/images/Login.png'),
            require('../../assets/images/image-placeholder.png'),
        ]);

        await Promise.all([...imageAssets]);
    }



    const [loaded] = useFonts({
        MontserratMedium: require('../../assets/fonts/Montserrat-Medium.ttf'),
        MontserratSemiBold: require('../../assets/fonts/Montserrat-SemiBold.ttf'),
        NunitoBold: require('../../assets/fonts/Nunito-Bold.ttf'),
        IBMMedium: require('../../assets/fonts/IBMPlexMono-Medium.ttf'),
      });
    


    if (!isReady || loading || !loaded) {
        return (
            <AppLoading
                startAsync={loadAssetsAsync}
                onFinish={() => setIsReady(true)}
                onError={console.warn}
            />
        );
    }



    return (
        loggedIn ? (
            <Tab.Navigator
                sceneContainerStyle={{ backgroundColor: "#E5E5E5" }}
                initialRouteName="OngoingOrders"
                tabBarOptions={{
                    "activeTintColor": "#FFFFFF",
                    "inactiveTintColor": "#303232",
                    "tabStyle": { marginTop: 10 },
                    "showLabel": false,
                    "style": { backgroundColor: '#000000', height: '11%', borderTopWidth: 0, elevation: 0, shadowOffset: { height: 0 } }
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={Home}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <FontAwesome5 name="store" size={34} color={color} />
                        ),
                    }}

                />
                <Tab.Screen
                    name="OngoingOrders"
                    component={OngoingOrders}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <FontAwesome5 name="clipboard-list" size={34} color={color} />
                        ),
                    }}

                />
                <Tab.Screen
                    name="CompletedOrders"
                    component={CompletedOrders}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="package" size={40} color={color} />
                        ),
                    }}

                />
                <Tab.Screen
                    name="Profile"
                    component={Profile}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name="dashboard" size={40} color={color} />
                        ),
                    }}

                />
            </Tab.Navigator>
        ) : (
            <Auth />
        )

    )
}

export default Main



function cacheImages(images) {
    return images.map(image => {
        if (typeof image === 'string') {
            return Image.prefetch(image);
        } else {
            return Asset.fromModule(image).downloadAsync();
        }
    });
}
