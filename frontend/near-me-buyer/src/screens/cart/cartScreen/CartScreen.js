import React, { useCallback, useState, useEffect } from 'react'
import { View, FlatList, RefreshControl, Text } from 'react-native'
import BagProductsCard from '../../../components/cards/BagProductsCard';
import OrderInfoCard from '../../../components/cards/OrderInfoCard';
import * as Haptics from 'expo-haptics';
import Button from '../../../components/basic/Button';
import { useSelector } from 'react-redux';
import LoadingScreen from '../../../components/LoadingScreen';

const CartScreen = ({ navigation }) => {

    const [refreshing, setRefreshing] = useState(false);
    const cartItems = useSelector(state => state.cart.cartItems);
    const loading = useSelector(state => state.cart.loading);


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        Haptics.selectionAsync()

        setTimeout(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            setRefreshing(false);
        }, 2000)

    }, []);

    useEffect(() => {
        navigation.setParams({ totalPrice: findTotalPrice() + 20 })
    }, [cartItems, loading]);


    const findTotalPrice = () => {
        if (cartItems) {
            return cartItems.reduce((accumulator, item) => accumulator + parseInt(item.price * item.quantity), 0);
        }
    }

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#E5E5E5", paddingTop: 10 }}>
            {cartItems && cartItems.length > 0 ? (
                <>
                    <View style={{ flex: 7 }}>
                        <FlatList
                            data={cartItems}
                            keyExtractor={item => item.product_id}
                            showsVerticalScrollIndicator={false}
                            ListFooterComponent={<OrderInfoCard subtotal={findTotalPrice()} deliveryCharge={20} />}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={['white']}
                                    enabled
                                    progressBackgroundColor="black"
                                    tintColor="black"
                                />}
                            renderItem={({ item }) => (
                                <View style={{ marginVertical: 10 }}>
                                    <BagProductsCard
                                        name={item.product_name}
                                        shop={item.seller_name}
                                        price={item.price}
                                        image={item.product_image}
                                        productId={item.product_id}
                                        sellerId={item.seller_id}
                                        quantity={item.quantity}
                                        cartItems={cartItems}
                                    />
                                </View>

                            )}
                        />
                    </View>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <Button
                            text={`CHECKOUT (₹${findTotalPrice() + 20})`}
                            width={'94%'}
                            onPress={() => navigation.navigate("BuyScreen", { subtotal: findTotalPrice(), deliveryCharge: 20 })}

                        />
                    </View>
                </>
            ) : (
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text style={{ fontSize: 22, alignSelf: "center", fontFamily: "IBMSemiBold" }}>Bag is empty!!</Text>
                </View>
            )}
        </View>
    )
}



export default CartScreen
