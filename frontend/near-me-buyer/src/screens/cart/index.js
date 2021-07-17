import React from 'react'
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import HeaderTitle from '../../components/title/HeaderTitle';
import PriceTag from '../../components/PriceTag';
import { useSelector } from 'react-redux';
const Stack = createStackNavigator();


//import Screens
import CartScreen from './cartScreen/CartScreen';
import BuyScreen from './buyScreen/BuyScreen';
import PaymentScreen from './paymentScreen/PaymentScreen';
import RapydPaymentScreen from './rapydPaymentScreen/RapydPaymentScreen';


const Cart = () => {

    const cartItems = useSelector(state => state.cart.cartItems);

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
                name="CartScreen"
                component={CartScreen}
                options={({ route }) => ({
                    headerTitle: props => <HeaderTitle {...props} name="Bag" />,
                    headerRight: cartItems && cartItems.length === 0 ? null : () => (
                        <View style={{ marginRight: 20 }}>
                            <PriceTag
                                price={route.params.totalPrice}
                                icon={<FontAwesome5 name="shopping-bag" size={24} color="black" />}
                            />
                        </View>
                    ),
                })}
                initialParams={{totalPrice: 0}}
            />
            <Stack.Screen
                name="BuyScreen"
                component={BuyScreen}
                options={() => ({
                    headerTitle: props => <HeaderTitle {...props} name="Purchase" />,
                })}
                initialParams={{
                    paymentType: "Select a payment option",
                    paymentDetail: "We provide card, wallet and borrow options",
                    PaymentImage: <MaterialIcons name="payments" size={24} color="#617CBF" />
                }}
            />
            <Stack.Screen
                name="PaymentScreen"
                component={PaymentScreen}
                options={() => ({
                    headerTitle: props => <HeaderTitle {...props} name="Payment" />,
                })}
            />
             <Stack.Screen
                name="RapydPaymentScreen"
                component={RapydPaymentScreen}
                options={() => ({
                    headerTitle: props => <HeaderTitle {...props} name="CheckOut" />,
                    headerLeft: null
                })}
            />
        </Stack.Navigator>
    )
}

export default Cart
