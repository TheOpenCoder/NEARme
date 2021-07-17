import React, { useState, useEffect, useRef, useCallback } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Pressable } from 'react-native';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { cartActions } from '../../redux/actions/cartActions';
import { useSelector, useDispatch } from 'react-redux';
import LoadingScreen from '../LoadingScreen';

const BagProductsCard = (props) => {

    const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
    const [quantity, setQuantity] = useStateCallback(props.quantity);
    const userId = useSelector(state => state.auth.user.id);
    const dispatch = useDispatch();

    const handleDeleteClick = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        dispatch(cartActions.deleteProductInBag(userId, {"product_id": props.productId} , createProductObj(), props.cartItems));
    }

    const handleWishListButtonClick = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsAddedToWishlist(!isAddedToWishlist);
    }


    const handleQuantityChange = (type) => {

        if(type === "minus"){
            setQuantity(
                prev => prev - 1,
                quantity => dispatch(cartActions.handleQuantityChange(userId, props.productId, quantity, createProductObj(), props.cartItems))
              )

        } else {
            setQuantity(
                prev => prev + 1,
                quantity => dispatch(cartActions.handleQuantityChange(userId, props.productId, quantity, createProductObj(), props.cartItems))
              )
        }

    }

    function useStateCallback(initialState) {
        const [state, setState] = useState(initialState);
        const cbRef = useRef(null); // mutable ref to store current callback
      
        const setStateCallback = useCallback((state, cb) => {
          cbRef.current = cb; // store passed callback to ref
          setState(state);
        }, []);
      
        useEffect(() => {
          // cb.current is `null` on initial render, so we only execute cb on state *updates*
          if (cbRef.current) {
            cbRef.current(state);
            cbRef.current = null; // reset callback after execution
          }
        }, [state]);
      
        return [state, setStateCallback];
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
                "quantity": quantity
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
                <Pressable style={{ flex: 2, paddingTop: 4, flexDirection: "row" }}>
                    <View style={{ flex: 4 }}>
                        <Text numberOfLines={2} style={{ fontFamily: "MontserratMedium", fontSize: 16 }}>{props.name}</Text>
                        <Text numberOfLines={1} style={{ color: "#464A29" }}>{props.shop}</Text>

                    </View>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity style={[styles.iconContainer, { width: 40, height: 40 }]} onPress={() => handleDeleteClick()}>
                            <SimpleLineIcons name="trash" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                </Pressable>
                <View style={{ flex: 1.5, flexDirection: "row" }}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={{ fontFamily: "MontserratSemiBold", fontSize: 16 }}>₹{props.price}</Text>
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={() => handleQuantityChange("minus")} disabled={quantity === 1 ? true : false}>
                            <AntDesign name="minuscircle" size={34} color={quantity === 1 ? "#707070" : "black"} />
                        </TouchableOpacity>
                        <View style={styles.iconContainer}>
                            <Text style={{ fontFamily: "MontserratSemiBold" }}>{quantity}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleQuantityChange("plus")}>
                            <AntDesign name="pluscircle" size={34} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default BagProductsCard

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 120,
        marginHorizontal: 10
    },
    header: {
        flex: 1,
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
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    iconContainer: {
        backgroundColor: "#F5F5F5",
        width: 34,
        height: 34,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20
    }
})
