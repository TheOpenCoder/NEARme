import React, {useState, useEffect} from 'react'
import { FlatList, View, Text } from 'react-native'

import ShopListCard from '../../../components/cards/ShopListCard';
import { sellerServices } from '../../../services';
import LoadingScreen from '../../../components/LoadingScreen';

const ByShop = ({ navigation, route }) => {

    const {name} = route.params;
    const [shops, setShops] = useState(null);


    useEffect(() => {
        sellerServices.allSellerFromCategory(name)
            .then(
                shops => {
                    setShops(shops);
                    navigation.setParams({
                        length: shops.length !== 0 && shops.length
                      })
                }
            ),
            err => console.log(err);
    }, [name]);

    if (shops === null) {
        return (
            <LoadingScreen />
        )
    }


    return (
        <FlatList
            data={shops}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => {
                return(
                    shops.length === 0 && (
                    <Text style={{fontSize: 24, marginTop: 20, textAlign: "center"}}>No Shops Available</Text>
                )
                )
            }}
            renderItem={({ item }) => (
                <View style={{ marginVertical: 10 }}>
                    <ShopListCard
                        name={item.name}
                        category={item.category}
                        openingTime={item.open_time}
                        closingTime={item.close_time}
                        location={item.location_name}
                        rating="4.4"
                        image={item.image}
                        sellerId={item.id}
                        navigation={navigation}
                    />
                </View>

            )}
        />
    )
}

export default ByShop

