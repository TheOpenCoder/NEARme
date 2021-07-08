import React from 'react'
import { FlatList, View } from 'react-native';
import OrdersCard from '../../../components/card/OrdersCard';
import { ordersData } from '../../../menu/temp/ordersData';

const CompletedOrdersScreen = () => {

    return (
        <View style={{ backgroundColor: "#E5E5E5" }}>
            <FlatList
                contentContainerStyle={{ paddingTop: 10, backgroundColor: "#E5E5E5" }}
                showsVerticalScrollIndicator={false}
                data={ordersData}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ marginVertical: 20 }}>
                        <OrdersCard
                            name={item.name}
                            time={item.time}
                            totalPrice={item.totalPrice}
                            userImage={item.userImage}
                            products={item.products}
                            type="ongoing"
                        />
                    </View>
                )}
            />
        </View>
    )
}

export default CompletedOrdersScreen
