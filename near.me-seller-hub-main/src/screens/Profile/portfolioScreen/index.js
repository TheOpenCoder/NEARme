import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import HeaderTitle from '../../../components/title/HeaderTitle';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();


//import Screens
import PortfolioScreen from './PortfolioScreen';


const PortfolioStack = () => {

    const navigation = useNavigation();


    return (
        <Stack.Navigator
            headerMode="screen"
            screenOptions={{
                headerStyle: { backgroundColor: "#E5E5E5", shadowOffset: { height: 0 } },
                headerTitleAlign: "left",
                headerBackTitleVisible: false,
                headerBackImage: () => <AntDesign name="leftcircle" size={32} color="black" />
            }}
        >
            <Stack.Screen
                name="PortfolioScreen"
                component={PortfolioScreen}
                options={{
                    headerTitle: props => <HeaderTitle {...props} name="Portfolio" />,
                    headerRight: () => (
                        <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.openDrawer()}>
                            <Entypo name="menu" size={32} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />
        </Stack.Navigator>
    )
}


export default PortfolioStack
