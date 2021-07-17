import React, { useEffect, useState } from 'react'
import { Entypo, FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../redux/actions';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { Asset } from 'expo-asset';


const Tab = createBottomTabNavigator();

//import screens
import Home from './home';
import Promise from './promise';
import Search from './search';
import Cart from './cart';
import Auth from './auth';

const Main = () => {

    const loggedIn = useSelector(state => state.auth.loggedIn);
    const loading = useSelector(state => state.auth.loading);
    const userLocation = useSelector(state => state.location.userLocation);
    const cartItems = useSelector(state => state.cart.cartItems);
    const cartLoading = useSelector(state => state.cart.loading);
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
            require('../../assets/images/grocery.png'),
            require('../../assets/images/pills.png'),
            require('../../assets/images/fashion.png'),
            require('../../assets/images/bag.png')
        ]);

        await Promise.all([...imageAssets]);
    }

    const [loaded] = useFonts({
        MontserratMedium: require('../../assets/fonts/Montserrat-Medium.ttf'),
        MontserratSemiBold: require('../../assets/fonts/Montserrat-SemiBold.ttf'),
        IBMMedium: require('../../assets/fonts/IBMPlexMono-Medium.ttf'),
        IBMSemiBold: require('../../assets/fonts/IBMPlexMono-SemiBold.ttf'),
        IBMRegular: require('../../assets/fonts/IBMPlexMono-Regular.ttf')
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
                    name="Home"
                    component={Home}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <Entypo name="home" size={30} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Search"
                    component={Search}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            // Prevent default action
                            e.preventDefault();
                            if (userLocation && userLocation.permission === "denied") {
                                alert("Location permission is neeeded");
                            } else {
                                navigation.navigate("Search");
                            }
                        },
                    })}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <FontAwesome name="search" size={30} color={color} />
                        ),
                    }}

                />
                <Tab.Screen
                    name="Promise"
                    component={Promise}
                    listeners={({ navigation }) => ({
                        tabPress: e => {
                            // Prevent default action
                            e.preventDefault();
                            if (userLocation && userLocation.permission === "denied") {
                                alert("Location permission is neeeded");
                            } else {
                                navigation.navigate("Promise");
                            }
                        },
                    })}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="handshake" size={38} color={color} />
                        ),
                        // tabBarBadge: true,
                    }}
                />
                <Tab.Screen
                    name="Cart"
                    component={Cart}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <FontAwesome5 name="shopping-bag" size={30} color={color} />
                        ),
                        tabBarBadge: cartItems && !cartLoading && cartItems.length,
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
