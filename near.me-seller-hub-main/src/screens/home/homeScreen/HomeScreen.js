import React, { useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, Pressable, Image } from 'react-native'
import { formatter } from '../../../helpers';
import Button from '../../../components/Button';
import { productsData } from '../../../menu/temp/productsData';
import ProductListCard from '../../../components/card/ProductListCard';
import HeaderTitle from '../../../components/title/HeaderTitle';
import { productActions } from '../../../redux/actions/productActions';
import { useSelector, useDispatch } from 'react-redux';
import LoadingScreen from '../../../components/LoadingScreen';

const HomeScreen = ({navigation}) => {


    const seller = useSelector(state => state.auth.seller);
    const sellerProducts = useSelector(state => state.product.sellerProducts);
    const loading = useSelector(state => state.product.loading);
    const dispatch = useDispatch();


    useEffect(() => {
      dispatch(productActions.getSellerProducts(seller.id));
    }, []);

    console.log(sellerProducts);

    if(loading){
        return <LoadingScreen />
    }

    return (
        <>
            {sellerProducts && sellerProducts.length > 0 ? (
                <FlatList
                data={sellerProducts}
                keyExtractor={item => item.product_id.toString()}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => <Header seller={seller} />}
                renderItem={({ item }) => (
                    <View style={{ marginVertical: 10 }}>
                        <ProductListCard
                            name={item.product_name}
                            shop={item.seller_name}
                            price={item.price}
                            image={item.product_image}
                            navigation={navigation}
                            sellerId={item.seller_id}
                            productId={item.product_id}
                            navigatePage="productScreen"
                        />
                    </View>

                )}
            />
            ) : (
                <>
                <Header 
                    seller={seller}
                />
                <Text style={[styles.boldText, {textAlign: "center", marginTop: 40}]}>No products available</Text>
                </>
            )}
            </>
    )
}


const Header = ({seller}) => {
    return(
        <>
        <Image source={{uri: seller.image}} style={{ height: 250, width: '100%' }} />
                <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                    <Pressable style={{ paddingTop: 6, flexDirection: "row", justifyContent: "space-between" }}>
                        <View>
                            <Text numberOfLines={2} style={styles.boldText}>{seller.name}</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: "600" }}>&#9733; 4.1</Text>
                        </View>
                    </Pressable>
                    <View style={{ justifyContent: "flex-end", paddingBottom: 10, marginTop: 10 }}>
                        <Text style={{ color: "#999999" }}>OPENS AT {formatter.formatTimeTo12HoursStandard(seller.open_time)}</Text>
                        <Text style={{ color: "#999999" }}>OPENED TILL {formatter.formatTimeTo12HoursStandard(seller.close_time)}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 20, marginHorizontal: 20 }}>
                    <Button text="Add Product" type="outline" width="48%" onPress={() => navigation.navigate("ProductUpload")} />
                    <Button text="Edit Page" width="48%" onPress={() => navigation.navigate("EditPage")} />
                </View>
                <HeaderTitle name="Products" style={{ marginLeft: 10 }} />
        </>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    cartButton: {
        padding: 16,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: "black",
        width: 200,
        alignItems: "center"
    },
    boldText: {
        fontFamily: "MontserratSemiBold", 
        fontSize: 20 
    }
})
