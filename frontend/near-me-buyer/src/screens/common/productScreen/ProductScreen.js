import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Pressable, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { formatter, validator } from '../../../helpers';
import { useSelector, useDispatch } from 'react-redux';
import * as Haptics from 'expo-haptics';

import ProductCard from '../../../components/cards/ProductCard';
import SubHeading from '../../../components/title/SubHeading';
import { productServices } from '../../../services';
import LoadingScreen from '../../../components/LoadingScreen';
import { cartActions } from '../../../redux/actions/cartActions';
import { cartHelper } from '../../../helpers';

const ProductScreen = ({ route }) => {


    const { productId, sellerId } = route.params;

    const [isAddedToCart, setIsAddedToCart] = useState(cartHelper.isProductAvailableInCart(productId));
    const [isShopOpen, setIsShopOpen] = useState(false);
    const [productDetails, setProductDetails] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [noSimilarProducts, setNoSimilarProducts] = useState(false);
    const userId = useSelector(state => state.auth.user.id);
    const cartItems = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();
    const navigation = useNavigation();



    

    useEffect(() => {
        productServices.getProductDetails(productId)
            .then(
                productDetails => {
                    setProductDetails(productDetails);
                }
            ),
            err => console.log(err);
    }, [productId]);


    useEffect(() => {
        if (productDetails) {
            if (validator.validateIfShopIsOpen(productDetails.open_time, productDetails.close_time)) {
                setIsShopOpen(true);
            } else {
                setIsShopOpen(false);
            }
        }
    }, []);
    

    useEffect(() => {
       if(productDetails){
           navigation.setParams({name: productDetails.product_name})
       }
    }, [productDetails]);


    useEffect(() => {
        if(productDetails){
            productServices.searchProduct(productDetails.product_name.substring(0, 4))
            .then(
                products => {
                    if (products && products.length === 0) setNoSimilarProducts(true);

                    // remove same product from list
                    setSimilarProducts(products.filter((product) => {
                        return product.product_id !== productId
                    }));
                }
            ),
            err => console.log(err);
        }
    }, [productDetails]);

    const handleCartButtonClick = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (isAddedToCart) {
            dispatch(cartActions.deleteProductInBag(userId, {"product_id": productId} , createProductObj(), cartItems));
            setIsAddedToCart(!isAddedToCart);
        } else {
            dispatch(cartActions.addToBag(userId, productId, 1, createProductObj(), cartItems));
            setIsAddedToCart(!isAddedToCart);
        }
    }

    const createProductObj = () => {
        if (productDetails) {
            return {
                "price": productDetails.price,
                "product_id": productId,
                "product_image":  productDetails.product_image,
                "product_name": productDetails.product_name,
                "seller_id": sellerId,
                "seller_name": productDetails.seller_name
            }
        }
    }


    if (productDetails === null) {
        return (
            <LoadingScreen />
        )
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Image source={{ uri: productDetails.product_image }} style={{ height: 250, width: '100%' }} />
            <View style={styles.headerContainer}>
                <Text style={{ fontFamily: "MontserratSemiBold", fontSize: 22 }}>₹{productDetails.price}</Text>
                <Pressable onPress={() => handleCartButtonClick()}>
                    {isAddedToCart ? (
                        <View style={styles.cartButton}>
                            <Text style={{ fontFamily: "MontserratSemiBold" }}>Remove from cart</Text>
                        </View>
                    ) : (
                        <View style={[styles.cartButton, { backgroundColor: "black" }]}>
                            <Text style={{ color: "white", fontFamily: "MontserratSemiBold" }}>Add to cart</Text>
                        </View>
                    )}
                </Pressable>
            </View>
            <View style={styles.shopDetailsContainer}>
                <Text style={{ color: "#464A29" }}>Shop details:</Text>
                <Pressable style={styles.shopPressable} onPress={() => navigation.navigate("shopScreen", { name: productDetails.seller_name, sellerId  })}>
                    <View>
                        <Text numberOfLines={2} style={{ fontFamily: "MontserratSemiBold", fontSize: 16 }}>{productDetails.seller_name}</Text>
                        <Text numberOfLines={1} style={{ color: "#464A29" }}>500 ms</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, fontWeight: "600" }}>&#9733; 4.1</Text>
                    </View>
                </Pressable>
                <View style={{ justifyContent: "flex-end", paddingBottom: 10 }}>
                    {isShopOpen ? (
                        <Text style={{ color: "#999999" }}>OPENED TILL {formatter.formatTimeTo12HoursStandard(productDetails.close_time.substring(0, 5))}, TODAY</Text>
                    ) : (
                        <Text style={{ color: "#999999" }}>OPENS AT {formatter.formatTimeTo12HoursStandard(productDetails.open_time.substring(0, 5))}, TODAY</Text>
                    )}

                </View>
            </View>
            {!noSimilarProducts && (
                <>
                    <SubHeading name="Similar Products" />
                    <FlatList
                        horizontal
                        contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
                        showsHorizontalScrollIndicator={false}
                        data={similarProducts}
                        ListHeaderComponent={() => {
                            return(
                                similarProducts.length === 0 && ( <Text style={{ marginTop: 20, fontSize: 24}}>No Similar Products</Text>)
                            )
                        }}
                        keyExtractor={item => item.product_id}
                        renderItem={({ item }) => (
                            <View style={{ marginHorizontal: 10, height: 290 }}>
                                <ProductCard
                                    name={item.product_name}
                                    shop={item.seller_name}
                                    price={item.price}
                                    image={item.product_image}
                                    navigation={navigation}
                                    productId={item.product_id}
                                    sellerId={item.seller_id}
                                />
                            </View>
                        )}
                    />
                </>
            )}
        </ScrollView>
    )
}

export default ProductScreen

const styles = StyleSheet.create({
    cartButton: {
        padding: 16,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: "black",
        width: 200,
        alignItems: "center"
    },
    container: {
        paddingTop: 10,
        backgroundColor: "#E5E5E5"
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 20,
        marginHorizontal: 20
    },
    shopDetailsContainer: {
        marginHorizontal: 20,
        marginTop: 20
    },
    shopPressable: {
        paddingTop: 6,
        flexDirection: "row",
        justifyContent: "space-between"
    }
})
