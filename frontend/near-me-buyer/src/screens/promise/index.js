import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import HeaderTitle from '../../components/title/HeaderTitle';

const Stack = createStackNavigator();


//import Screens
import PromiseScreen from './promiseScreen/PromiseScreen';
import RepayScreen from './repayScreen/RepayScreen';


const Promise = () => {
    return (
        <Stack.Navigator
            headerMode="screen"
            screenOptions={{
                headerLeftContainerStyle: { marginLeft: 25, marginTop: 4 },
                headerStyle: { backgroundColor: "#E5E5E5", shadowOffset: { height: 0 } },
                headerTitleAlign: "left",
                headerBackTitleVisible: false,
                headerBackImage: () => <AntDesign name="leftcircle" size={32} color="black" />
            }}
        >
            <Stack.Screen
                name="PromiseScreen"
                component={PromiseScreen}
                options={{
                    headerTitle: props => <HeaderTitle {...props} name="Promise" />
                }}
            />
            <Stack.Screen
                name="RepayScreen"
                component={RepayScreen}
                options={{
                    headerTitle: props => <HeaderTitle {...props} name="Repay" />
                }}
            />

        </Stack.Navigator>
    )
}

export default Promise
