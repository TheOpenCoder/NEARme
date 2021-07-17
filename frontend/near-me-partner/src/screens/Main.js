import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../redux/actions';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { Asset } from 'expo-asset';


const Tab = createBottomTabNavigator();

//import Screens
import Portfolio from './portfolio';
import Delivery from './delivery';
import Auth from './auth';


const Main = () => {

    const [isReady, setIsReady] = useState(false);

    function hideBottomTabInDirectionPage(route) {
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'DeliveryRequest';

        switch (routeName) {
            case 'DeliveryDirection':
                return false;
            case 'DeliveryRequest':
                return true;
        }
    }
    
    const loggedIn = useSelector(state => state.auth.loggedIn);
    const loading = useSelector(state => state.auth.loading);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(authActions.replenish());
    }, []);



    const loadAssetsAsync = async () => {
        const imageAssets = cacheImages([
            require('../../assets/images/nearLogo.png'),
            require('../../assets/images/Register.png'),
            require('../../assets/images/Login.png'),
            require('../../assets/images/shop-location-pin.png'),
            require('../../assets/images/location-pin.png'),
        ]);

        await Promise.all([...imageAssets]);
    }


    const [loaded] = useFonts({
        MontserratMedium: require('../../assets/fonts/Montserrat-Medium.ttf'),
        MontserratSemiBold: require('../../assets/fonts/Montserrat-SemiBold.ttf'),
        IBMMedium: require('../../assets/fonts/IBMPlexMono-Medium.ttf'),
        IBMSemiBold: require('../../assets/fonts/IBMPlexMono-SemiBold.ttf'),
        NunitoBold: require('../../assets/fonts/Nunito-Bold.ttf')
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
                tabBarOptions={{
                    "activeTintColor": "#FFFFFF",
                    "inactiveTintColor": "#303232",
                    "tabStyle": { marginTop: 10 },
                    "showLabel": false,
                    "style": { backgroundColor: '#000000', height: '11%', borderTopWidth: 0, elevation: 0, shadowOffset: { height: 0 } }
                }}
            >
                <Tab.Screen
                    name="Delivery"
                    component={Delivery}
                    options={({ route }) => ({
                        tabBarIcon: ({ color }) => (
                            <FontAwesome5 name="clipboard-list" size={34} color={color} />
                        ),
                        tabBarVisible: hideBottomTabInDirectionPage(route)
                    })}
                />
                <Tab.Screen
                    name="Portfolio"
                    component={Portfolio}
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
