import React, {useEffect} from 'react'
import { FlatList, View } from 'react-native';
import OrdersCard from '../../../components/card/OrdersCard';
import { orderActions } from '../../../redux/actions/orderActions';
import { useDispatch, useSelector } from 'react-redux';
import LoadingScreen from '../../../components/LoadingScreen';
import CenteredText from '../../../components/CenteredText';

const CompletedOrdersScreen = () => {

    const dispatch = useDispatch();
    const completedOrders = useSelector(state => state.orders.completedOrders);
    const loading = useSelector(state => state.orders.loading);
    const sellerId = useSelector(state => state.auth.seller.id);

    useEffect(() => {
        dispatch(orderActions.getCompletedOrders(sellerId));
    }, []);

    if(loading){
        return <LoadingScreen />
    }

    if((completedOrders && completedOrders.length === 0)){
        return <CenteredText text="No Completed Orders" />
    }


    return (
        <View style={{ backgroundColor: "#E5E5E5",flex:1 }}>
            <FlatList
                contentContainerStyle={{ paddingTop: 10, backgroundColor: "#E5E5E5" }}
                showsVerticalScrollIndicator={false}
                data={completedOrders}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ marginVertical: 20 }}>
                        <OrdersCard
                            name={item.user_name}
                            time="1 min"
                            totalPrice={item.order_price}
                            userImage={item.user_image}
                            products={item.products}
                            orderStatus={item.order_status}
                        />
                         <View style={{ borderBottomColor: "#BBBBBB", borderBottomWidth: 1, marginTop: 20, marginHorizontal: 10 }}></View>
                    </View>  
                )}
            />
        </View>
    )
}

export default CompletedOrdersScreen
