import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import HeaderTitle from '../../components/title/HeaderTitle';
const Stack = createStackNavigator();


//import Screens
import HomeScreen from './homeScreen/HomeScreen';
import ProductUpload from './productUpload/ProductUpload';
import EditPage from './editPage/EditPage';

const Home = () => {
    return (
        <Stack.Navigator
            headerMode="screen"
            screenOptions={{
                headerLeftContainerStyle: { marginLeft: 25, marginTop: 4 },
                headerStyle: { backgroundColor: "#E5E5E5", shadowOffset: { height: 0 }, elevation: 0 },
                headerTitleAlign: "left",
                headerBackTitleVisible: false,
                headerBackImage: () => <AntDesign name="leftcircle" size={32} color="black" />
            }}
        >
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    headerTitle: props => <HeaderTitle {...props} name="near.me seller hub" style={{ fontSize: 24 }} />
                }}
            />
            <Stack.Screen
                name="ProductUpload"
                component={ProductUpload}
                options={{
                    headerTitle: props => <HeaderTitle {...props} name="Add Product" />
                }}
            />
            <Stack.Screen
                name="EditPage"
                component={EditPage}
                options={{
                    headerTitle: props => <HeaderTitle {...props} name="Edit Page" />
                }}
            />
        </Stack.Navigator>
    )
}

export default Home
