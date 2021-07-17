import React from 'react'
import { createDrawerNavigator, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';
import { SafeAreaView, Text } from 'react-native';
import HeaderTitle from '../../components/title/HeaderTitle';
const Drawer = createDrawerNavigator();
import { authActions } from '../../redux/actions';
import { useDispatch } from 'react-redux';

//import Screens
import PortfolioStack from './portfolioScreen';
import ProfileStack from './profile';


const Portfolio = () => {
    return (
        <Drawer.Navigator
            drawerContent={props => <CustomDrawerContent {...props} />}
            drawerPosition="right"
            drawerType="back"
            drawerStyle={{ backgroundColor: "#E5E5E5" }}
            hideStatusBar={true}
            statusBarAnimation="fade"
            drawerContentOptions={{
                activeTintColor: "#E5E5E5",
                activeBackgroundColor: "rgba(112,112,112,0.9)",
            }}
        >
            <Drawer.Screen
                name="ProfileStack"
                component={ProfileStack}
                options={{
                    title: ({ color }) => <HeaderTitle name="Profile" style={{ color }} />,

                }}
            />
            <Drawer.Screen
                name="PortfolioStack"
                component={PortfolioStack}
                options={{
                    title: ({ color }) => <HeaderTitle name="Portfolio" style={{ color }} />
                }}
            />

        </Drawer.Navigator>
    )
}

export default Portfolio




function CustomDrawerContent({ progress, ...rest }) {
    const translateX = Animated.interpolateNode(progress, {
        inputRange: [0, 1],
        outputRange: [1000, 0],
    });

    const dispatch = useDispatch();

    return (
        <SafeAreaView {...rest} style={{ flex: 1, justifyContent: "space-between", marginVertical: 10 }}>
            <Animated.View style={{ transform: [{ translateX }], flex: 1, justifyContent: "center" }}>
                <DrawerItemList {...rest} />
            </Animated.View>
            <Animated.View style={{ transform: [{ translateX }] }}>
                <DrawerItem
                    label={() => <Text style={{ color: "white", fontFamily: "MontserratMedium" }}>Log Out</Text>}
                    onPress={() => dispatch(authActions.logout())}
                    style={{ backgroundColor: "black" }}
                />
            </Animated.View>
        </SafeAreaView>
    );
}

