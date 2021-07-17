import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSelector, useDispatch } from 'react-redux';
import { cartActions, wishlistActions } from '../../redux/actions';
import { cartHelper, wishlistHelper } from '../../helpers';

const ProductListCard = (props) => {

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
            <View style={styles.header}>
                <Image source={{uri: props.image}} style={styles.image} />

                <TouchableOpacity style={styles.wishlist} onPress={() => handleWishListButtonClick()}>
                    {isAddedToWishlist ? (
                        <AntDesign name="heart" size={19} color="red" />
                    ) : (
                        <AntDesign name="hearto" size={19} color="#977FAF" />
                    )}
                </TouchableOpacity>
            </View>
            <View style={{ flex: 2 }}>
                <Pressable style={{ flex: 2, paddingTop: 4 }} onPress={() => props.navigation.navigate("productScreen", { productId: props.productId, sellerId: props.sellerId })}>
                    <Text numberOfLines={2} style={{ fontFamily: "MontserratMedium", fontSize: 16 }}>{props.name}</Text>
                    <Text numberOfLines={1} style={{ color: "#464A29" }}>{props.shop}</Text>
                </Pressable>
                <View style={{ flex: 1.5, flexDirection: "row"}}>
                    <View style={{ flex: 4, justifyContent: "center"  }}>
                        <Text style={{ fontFamily: "MontserratSemiBold", fontSize: 20 }}>₹{props.price}</Text>
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={() => handleCartButtonClick()}>
                            {isAddedToCart ? (
                                <Image source={require('../../../assets/images/deleteBag.png')} style={styles.bagIcon} />
                            ) : (
                                <Image source={require('../../../assets/images/bag.png')} style={styles.bagIcon} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default ProductListCard

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 120,
        marginHorizontal: 10
    },
    header: {
        flex: 1.2,
        marginRight: 10,
        position: "relative"
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
    },
    footer: {
        flex: 1.5,
        justifyContent: "flex-end",
        alignItems: "center",
        flexDirection: "row"
    }
})
