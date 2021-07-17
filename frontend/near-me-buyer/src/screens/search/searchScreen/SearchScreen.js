import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

import SearchBar from '../../../components/SearchBar';
import CategoryCard from '../../../components/cards/CategoryCard';
import { categoriesMenu } from '../../../menus';
import ProductListCard from '../../../components/cards/ProductListCard';
import { productServices } from '../../../services';
import LoadingScreen from '../../../components/LoadingScreen';


const SearchScreen = ({ navigation }) => {

    const [searchText, setSearchText] = useState("");
    const [products, setProducts] = useState([]);
    const [noProducts, setNoProducts] = useState(false);

    useEffect(() => {
       searchProducts()
    }, [searchText]);

    //suggest products api
    const searchProducts = () => {
        if (!searchText || searchText.trim() === "") return;
        setNoProducts(false);
        productServices.searchProduct(searchText)
            .then(
                products => {
                    if (products && products.length === 0) setNoProducts(true);
                    setProducts(products);
                },
                error => {
                    dispatch(alertActions.error(error.toString()));
                })
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#E5E5E5" }}>
            <View style={{ marginBottom: 10 }}>
                <SearchBar
                    searchText={searchText}
                    setSearchText={setSearchText}
                />
            </View>
            {searchText.length > 0 && noProducts && <Text style={styles.heading}>No Such Products Available</Text>}
            {!searchText ? (
                <>
                    <Text style={styles.heading}>Search by category</Text>
                    <FlatList
                        horizontal
                        contentContainerStyle={{ paddingLeft: 20, paddingRight: 10, marginBottom: 100 }}
                        showsHorizontalScrollIndicator={false}
                        data={categoriesMenu}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate("categoryScreen", { name: item.name })}>
                                <CategoryCard
                                    name={item.name}
                                    icon={item.icon}
                                />
                            </TouchableOpacity>
                        )}
                    />
                </>
            ) : (
                <FlatList
                data={products}
                keyExtractor={item => item.product_id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={{ marginVertical: 10 }}>
                        <ProductListCard
                            name={item.product_name}
                            shop={item.seller_name}
                            price={item.price}
                            image={item.product_image}
                            navigation={navigation}
                            productId={item.product_id}
                        />
                    </View>

                )}
            />
            )}
        </SafeAreaView>
    )
}

export default SearchScreen

const styles = StyleSheet.create({
    heading: {
        fontFamily: "MontserratMedium", 
        fontSize: 26, 
        margin: 25, 
        marginBottom: 10
    }
})