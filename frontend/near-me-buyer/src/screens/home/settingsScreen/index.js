import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import HeaderTitle from '../../../components/title/HeaderTitle';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();


//import Screens
import SettingsScreen from './SettingsScreen';



const SettingsStack = () => {

    const navigation = useNavigation();


    return (
        <Stack.Navigator
            headerMode="screen"
            screenOptions={{
                headerLeftContainerStyle: { marginLeft: 16, marginTop: 4, paddingLeft: 8 },
                headerStyle: { backgroundColor: "#E5E5E5", shadowOffset: { height: 0 } },
                headerTitleAlign: "left",
                headerBackTitleVisible: false,
                headerBackImage: () => <AntDesign name="leftcircle" size={32} color="black" />
            }}
        >
            <Stack.Screen
                name="SettingsScreen"
                component={SettingsScreen}
                options={{
                    headerTitle: props => <HeaderTitle {...props} name="Settings" />,
                    headerLeft: () => (
                        <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.openDrawer()}>
                            <Entypo name="menu" size={34} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />
        </Stack.Navigator>
    )
}


export default SettingsStack
