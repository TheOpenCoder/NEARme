import React, {useEffect} from 'react'
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { cartActions, wishlistActions } from '../../redux/actions';

//components
import HeaderTitle from '../../components/title/HeaderTitle';
import PageTitle from '../../components/title/PageTitle';


const Stack = createStackNavigator();

//import Screens
import HomeScreen from './homeScreen/HomeScreen';
import CategoryScreen from '../common/categoryScreen/CategoryScreen';
import WishlistScreen from './wishlistScreen/WishlistScreen';
import ProductScreen from '../common/productScreen/ProductScreen';
import ShopScreen from '../common/shopScreen/ShopScreen';
import ProfileScreen from './profileScreen/ProfileScreen';

const HomeStack = () => {

    const user = useSelector(state => state.auth.user);
    const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
    const wishlistLoading = useSelector(state => state.wishlist.loading);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(cartActions.getProductsInBag(user.id))
        dispatch(wishlistActions.getProductsInWishlist(user.id))
      }, []);


    return (
        <Stack.Navigator
            headerMode="screen"
            screenOptions={{
                headerLeftContainerStyle: { marginLeft: 16, marginTop: 2, paddingLeft: 8 },
                headerStyle: { backgroundColor: "#E5E5E5", shadowOffset: { height: 0 }, elevation: 0 },
                headerTitleAlign: "left",
                headerTitleContainerStyle: {},
                headerBackTitleVisible: false,
                headerBackImage: () => <AntDesign name="leftcircle" size={32} color="black" />,
            }}
        >
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={({ navigation }) => ({
                    headerTitle: props => <HeaderTitle {...props} name={user ? user.location_name : "NEARme"} style={{ fontSize: 26 }} />,
                    headerLeft: () => (
                        <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.openDrawer()}>
                            <Entypo name="menu" size={34} color="black" />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate("WishlistScreen")}>
                            <FontAwesome name="heart" size={26} color="black" />
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen
                name="categoryScreen"
                component={CategoryScreen}
                options={({ route }) => ({
                    headerTitle: props => <HeaderTitle {...props} name={route.params.name} />,
                })}
            />
            <Stack.Screen
                name="WishlistScreen"
                component={WishlistScreen}
                options={() => ({
                    headerTitle: props => <HeaderTitle {...props} name="Wishlist" quantity={wishlistItems && !wishlistLoading && wishlistItems.length.toString()} />,
                })}
            />
            <Stack.Screen
                name="productScreen"
                component={ProductScreen}
                options={({ route }) => ({
                    headerTitle: () => <PageTitle name={route.params.name} />,
                })}
            />
            <Stack.Screen
                name="shopScreen"
                component={ShopScreen}
                options={({ route }) => ({
                    headerTitle: () => <PageTitle name={route.params.name} />,
                })}
            />
            <Stack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={() => ({
                    headerTitle: props => <HeaderTitle {...props} name="Profile" />,
                })}
            />
        </Stack.Navigator>
    )
}

export default HomeStack
