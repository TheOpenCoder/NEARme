import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { formatter, validator } from '../../../helpers';



import SubHeading from '../../../components/title/SubHeading';
import ProductListCard from '../../../components/cards/ProductListCard';
import { sellerServices } from '../../../services';
import LoadingScreen from '../../../components/LoadingScreen';


const ShopScreen = ({route}) => {

    const { sellerId } = route.params;

    const [isShopOpen, setIsShopOpen] = useState(false);
    const [sellerDetails, setSellerDetails] = useState(null);
    const [sellerProducts, setSellerProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        sellerServices.getSellerDetails(sellerId)
            .then(
                sellerDetails => {
                    setSellerDetails(sellerDetails);
                }
            ),
            err => console.log(err);
    }, [sellerId]);


    useEffect(() => {
        if(sellerDetails){
            if (validator.validateIfShopIsOpen(sellerDetails.open_time, sellerDetails.close_time)) {
                setIsShopOpen(true);
            } else {
                setIsShopOpen(false);
            }
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        sellerServices.getSellerProducts(sellerId)
        .then(
            sellerProducts => {
                setSellerProducts(sellerProducts);
                setLoading(false);
            }
        ),
        err => {
            console.log(err);
            setLoading(false);
        }
    }, [sellerId]);



    if(sellerDetails === null){
        return <LoadingScreen />
    }

    if(loading){
        return <LoadingScreen />
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Image source={{uri: sellerDetails.image}} style={styles.image} />
            <View style={styles.detailsContainer}>
                <View style={styles.details}>
                    <View>
                        <Text numberOfLines={1} style={{ color: "#464A29", fontSize: 20 }}>{sellerDetails.category}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: "600" }}>&#9733; 4.1</Text>
                    </View>
                </View>
                <View style={styles.shopTiming}>
                    {isShopOpen ? (
                        <Text style={{ color: "#999999" }}>OPENED TILL {formatter.formatTimeTo12HoursStandard(sellerDetails.close_time.substring(0, 5))}, TODAY</Text>
                    ) : (
                        <Text style={{ color: "#999999" }}>OPENS AT {formatter.formatTimeTo12HoursStandard(sellerDetails.open_time.substring(0, 5))}, TODAY</Text>
                    )}

                </View>
            </View>
            <SubHeading name="Products" />
            <FlatList
                data={sellerProducts}
                keyExtractor={item => item.product_id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={{ marginVertical: 10 }}>
                        <ProductListCard
                            name={item.product_name}
                            shop={item.seller_name}
                            price={item.price}
                            image={item.product_image}
                            productId={item.product_id}
                            sellerId={item.seller_id}
                            navigation={navigation}
                            navigatePage="productScreen"
                        />
                    </View>

                )}
            />
        </ScrollView>
    )
}

export default ShopScreen

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        backgroundColor: "#E5E5E5"
    },
    image: {
        height: 250,
        width: '100%'
    },
    detailsContainer: {
        marginHorizontal: 20,
        marginTop: 20
    },
    details: {
        paddingTop: 6,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    shopTiming: {
        justifyContent: "flex-end",
        paddingBottom: 10
    }
})
