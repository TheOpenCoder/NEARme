import React from 'react'
import { createDrawerNavigator, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';
import { SafeAreaView, Text, Image, View, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderTitle from '../../components/title/HeaderTitle';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../redux/actions';

const Drawer = createDrawerNavigator();

//import Screens
import HomeStack from './HomeStack';
import SettingsStack from './settingsScreen';


const Home = () => {
    return (
        <Drawer.Navigator
            drawerContent={props => <CustomDrawerContent {...props} />}
            drawerPosition="left"
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
                name="HomeStack"
                component={HomeStack}
                options={{
                    title: ({ color }) => <HeaderTitle name="Home" style={{ color }} />
                }}
            />
            <Drawer.Screen
                name="SettingsStack"
                component={SettingsStack}
                options={{
                    title: ({ color }) => <HeaderTitle name="Settings" style={{ color }} />,

                }}
            />
        </Drawer.Navigator>
    )
}

export default Home




function CustomDrawerContent({ progress, ...rest }) {


    const navigation = useNavigation();
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    const translateX = Animated.interpolateNode(progress, {
        inputRange: [0, 1],
        outputRange: [-1000, 0],
    });

    return (
        <SafeAreaView {...rest} style={styles.drawerContainer}>
            <Animated.View style={{ transform: [{ translateX }] }}>
                <Pressable style={styles.profilePressable} onPress={() => navigation.navigate("ProfileScreen")}>
                    <Image source={{uri: user.image}} style={styles.image} />
                    <View style={{ flex: 1 }}>
                        <Text numberOfLines={2} style={{ fontSize: 24, fontFamily: "MontserratSemiBold" }}>{user.name}</Text>
                        <Text numberOfLines={1}>{user.email}</Text>
                    </View>
                </Pressable>
            </Animated.View>
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

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        justifyContent: "space-between",
        marginVertical: 10,
    },
    profilePressable: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: 10
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 24,
        marginHorizontal: 10
    }
})