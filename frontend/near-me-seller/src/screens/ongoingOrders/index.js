import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import HeaderTitle from '../../components/title/HeaderTitle';
const Stack = createStackNavigator();


//import Screens
import OngoingOrdersScreen from './ongoingOrdersScreen/OngoingOrdersScreen';


const OngoingOrders = () => {
    return (
        <Stack.Navigator
            headerMode="screen"
            screenOptions={{
                headerStyle: { backgroundColor: "#E5E5E5", shadowOffset: { height: 0 }, elevation: 0 },
                headerTitleAlign: "left",
                headerBackTitleVisible: false,
                headerBackImage: () => <AntDesign name="leftcircle" size={32} color="black" />
            }}
        >
            <Stack.Screen
                name="OngoingOrdersScreen"
                component={OngoingOrdersScreen}
                options={{
                    headerTitle: props => <HeaderTitle {...props} name="Ongoing Orders" />
                }}
            />
        </Stack.Navigator>
    )
}

export default OngoingOrders
