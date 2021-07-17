import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import HeaderTitle from '../../components/title/HeaderTitle';
const Stack = createStackNavigator();


//import Screens
import DeliveryRequest from './deliveryRequest/DeliveryRequest';
import DeliveryDirection from './deliveryDirection/DeliveryDirection';


const Delivery = () => {
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
                name="DeliveryRequest"
                component={DeliveryRequest}
                options={{
                    headerTitle: props => <HeaderTitle {...props} name="near.me delivery partner" style={{ fontSize: 24 }} />
                }}
            />
            <Stack.Screen
                name="DeliveryDirection"
                component={DeliveryDirection}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

export default Delivery
