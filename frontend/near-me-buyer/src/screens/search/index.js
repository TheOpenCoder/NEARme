import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import HeaderTitle from '../../components/title/HeaderTitle';
import PageTitle from '../../components/title/PageTitle';

const Stack = createStackNavigator();


//import Screens
import SearchScreen from './searchScreen/SearchScreen';
import CategoryScreen from '../common/categoryScreen/CategoryScreen';
import ProductScreen from '../common/productScreen/ProductScreen';
import ShopScreen from '../common/shopScreen/ShopScreen';



const Search = () => {
    return (
        <Stack.Navigator
            headerMode="screen"
            screenOptions={{
                headerLeftContainerStyle: { marginLeft: 16, marginTop: 4 },
                headerStyle: { backgroundColor: "#E5E5E5", shadowOffset: { height: 0 }, elevation: 0 },
                headerTitleAlign: "left",
                headerBackTitleVisible: false,
                headerBackImage: () => <AntDesign name="leftcircle" size={32} color="black" />,
            }}
        >
            <Stack.Screen
                name="SearchScreen"
                component={SearchScreen}
                options={() => ({
                    headerShown: false
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
        </Stack.Navigator>
    )
}

export default Search
