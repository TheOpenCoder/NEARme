import React from 'react'
import { View, FlatList, Text } from 'react-native';
import { useSelector } from 'react-redux';

import ProductListCard from '../../../components/cards/ProductListCard';
import LoadingScreen from '../../../components/LoadingScreen';


const WishlistScreen = ({ navigation }) => {

    const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
    const loading = useSelector(state => state.wishlist.loading);

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#E5E5E5", paddingTop: 10 }}>
            {wishlistItems && wishlistItems.length > 0 ? (
                <FlatList
                    data={wishlistItems}
                    keyExtractor={item => item.product_id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={{ marginVertical: 10 }}>
                            <ProductListCard
                                name={item.product_name}
                                shop={item.seller_name}
                                price={item.price}
                                image={item.product_image}
                                sellerId={item.seller_id}
                                productId={item.product_id}
                                navigation={navigation}
                            />
                        </View>

                    )}
                />
            ) : (
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text style={{ fontSize: 22, alignSelf: "center", fontFamily: "IBMSemiBold" }}>Wishlist is empty!!</Text>
                </View>
            )}
        </View>
    )
}

export default WishlistScreen

