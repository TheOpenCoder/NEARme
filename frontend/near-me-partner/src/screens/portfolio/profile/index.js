import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import HeaderTitle from '../../../components/title/HeaderTitle';
import { useNavigation } from '@react-navigation/native';
import PriceTag from '../../../components/PriceTag';

//import Screens
import ProfileScreen from './ProfileScreen';
import WithdrawScreen from './WithdrawScreen';


const Stack = createStackNavigator();


const ProfileStack = () => {

    const navigation = useNavigation();

    return (
        <Stack.Navigator
            headerMode="screen"
            screenOptions={{
                headerLeftContainerStyle: { marginLeft: 16 },
                headerStyle: { backgroundColor: "#E5E5E5", shadowOffset: { height: 0 } },
                headerTitleAlign: "left",
                headerBackTitleVisible: false,
                headerBackImage: () => <AntDesign name="leftcircle" size={32} color="black" />
            }}
        >
            <Stack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                    headerTitle: props => <HeaderTitle {...props} name="Profile" />,
                    headerRight: () => (
                        <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.openDrawer()}>
                            <Entypo name="menu" size={32} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="WithdrawScreen"
                component={WithdrawScreen}
                options={{
                    headerTitle: props => <HeaderTitle {...props} name="Withdraw" />,
                    headerRight: () => (
                        <TouchableOpacity style={{ marginRight: 20 }}>
                            <PriceTag
                                price="24522"
                                icon={<Entypo name="wallet" size={24} color="black" />}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
        </Stack.Navigator>
    )
}



export default ProfileStack


