import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { cartHelper, wishlistHelper } from '../../helpers';
import { cartActions, wishlistActions } from '../../redux/actions';
import { useSelector, useDispatch } from 'react-redux';

const ProductCard = (props) => {
    const [isAddedToCart, setIsAddedToCart] = useState(cartHelper.isProductAvailableInCart(props.productId));
    const [isAddedToWishlist, setIsAddedToWishlist] = useState(wishlistHelper.isProductAvailableInWishlist(props.productId));
    const userId = useSelector(state => state.auth.user.id);
    const cartItems = useSelector(state => state.cart.cartItems);
    const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
    const dispatch = useDispatch();

    const handleCartButtonClick = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (isAddedToCart) {
            dispatch(cartActions.deleteProductInBag(userId, {"product_id": props.productId} , createProductObj(), cartItems));
            setIsAddedToCart(!isAddedToCart);
        } else {
            dispatch(cartActions.addToBag(userId, props.productId, 1, createProductObj(), cartItems));
            setIsAddedToCart(!isAddedToCart);
        }
    }

    const handleWishListButtonClick = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (isAddedToWishlist) {
            dispatch(wishlistActions.deleteProductInWishlist(userId, {"product_id": props.productId} , createProductObj(), wishlistItems));
            setIsAddedToWishlist(!isAddedToWishlist);
        } else {
            dispatch(wishlistActions.addToWishlist(userId, props.productId, createProductObj(), wishlistItems));
            setIsAddedToWishlist(!isAddedToWishlist);
        }
    }

    const createProductObj = () => {
        if (props) {
            return {
                "price": props.price,
                "product_id": props.productId,
                "product_image": props.image,
                "product_name": props.name,
                "seller_id": props.sellerId,
                "seller_name": props.shop,
                "quantity": 1
            }
        }
    }


    return (
        <View style={styles.container}>
            <View style={{ height: 120, margin: 10 }}>
                <Image source={{ uri: props.image }} style={styles.image} />
                <TouchableOpacity style={styles.wishlist} onPress={() => handleWishListButtonClick()}>
                    {isAddedToWishlist ? (
                        <AntDesign name="heart" size={19} color="red" />
                    ) : (
                        <AntDesign name="hearto" size={19} color="#977FAF" />
                    )}
                </TouchableOpacity>
            </View>
            <Pressable style={{ flex: 1.5, padding: 10 }} onPress={() => props.navigation.navigate("productScreen", { productId: props.productId, sellerId: props.sellerId })}>
                <Text numberOfLines={2} style={{ fontFamily: "MontserratSemiBold", fontSize: 16 }}>{props.name}</Text>
                <Text numberOfLines={1} style={{ fontFamily: "MontserratMedium", fontSize: 14, marginTop: 3 }}>{props.shop}</Text>
            </Pressable>
            <View style={styles.footer}>
                <Text style={{ fontFamily: "MontserratSemiBold", fontSize: 18 }}>₹{props.price}</Text>
                <TouchableOpacity onPress={() => handleCartButtonClick()}>
                    {isAddedToCart ? (
                        <Image source={require('../../../assets/images/deleteBag.png')} style={styles.bagIcon} />
                    ) : (
                        <Image source={require('../../../assets/images/bag.png')} style={styles.bagIcon} />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ProductCard

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F3F3F5",
        width: 180,
        height: 270,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5
    },
    footer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
        alignItems: "center"
    },
    image: {
        flex: 1,
        width: null,
        height: null,
        borderRadius: 10,
        resizeMode: "cover"
    },
    bagIcon: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    wishlist: {
        backgroundColor: "#F3F3F5",
        width: 30,
        height: 30,
        borderRadius: 20,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        right: 5,
        top: 5
    }
})
