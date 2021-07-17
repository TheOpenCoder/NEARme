import React, {useEffect, useState} from 'react'
import { View, FlatList, Text } from 'react-native'

import ProductListCard from '../../../components/cards/ProductListCard';
import { productServices } from '../../../services';
import LoadingScreen from '../../../components/LoadingScreen';

const ByProduct = ({ navigation, route }) => {

    const {name} = route.params;
    const [products, setProducts] = useState(null);


    useEffect(() => {
        productServices.allProductsFromCategory(name)
            .then(
                products => {
                    setProducts(products);
                    navigation.setParams({
                        length: products.length !== 0 && products.length
                      })
                }
            ),
            err => console.log(err);
    }, [name]);

    if (products === null) {
        return (
            <LoadingScreen />
        )
    }

    return (
        <FlatList
            data={products}
            keyExtractor={item => item.product_id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => {
                return(
                products.length === 0 && (
                    <Text style={{fontSize: 24, marginTop: 20, textAlign: "center"}}>No Products Available</Text>
                )
                )
            }}
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
    )
}

export default ByProduct

