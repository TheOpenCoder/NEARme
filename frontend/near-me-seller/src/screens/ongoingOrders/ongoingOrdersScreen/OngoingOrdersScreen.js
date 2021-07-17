import React, {useEffect} from 'react'
import { View, FlatList } from 'react-native';
import OrdersCard from '../../../components/card/OrdersCard';
import { orderActions } from '../../../redux/actions/orderActions';
import { useDispatch, useSelector } from 'react-redux';
import LoadingScreen from '../../../components/LoadingScreen';
import CenteredText from '../../../components/CenteredText';

const OngoingOrdersScreen = () => {

    const dispatch = useDispatch();
    const ongoingOrders = useSelector(state => state.orders.ongoingOrders);
    const loading = useSelector(state => state.orders.loading);
    const sellerId = useSelector(state => state.auth.seller.id);

    useEffect(() => {
        dispatch(orderActions.getOngoingOrders(sellerId));
    }, []);

    if(loading){
        return <LoadingScreen />
    }

    if((ongoingOrders && ongoingOrders.length === 0)){
        return <CenteredText text="No Ongoing Orders" />
    }

    return (
        <View style={{ backgroundColor: "#E5E5E5", flex:1}}>
            <FlatList
                contentContainerStyle={{ paddingTop: 10, backgroundColor: "#E5E5E5" }}
                showsVerticalScrollIndicator={false}
                data={ongoingOrders}
                keyExtractor={item => item.order_id}
                renderItem={({ item }) => (
                    <View style={{ marginVertical: 20 }}>
                        <OrdersCard
                            name={item.user_name}
                            time="1 min"
                            totalPrice={item.order_price}
                            userImage={item.user_image}
                            products={item.products}
                            userId={item.user_id}
                            orderId={item.order_id}
                            sellerId={item.seller_id}
                            partnerId={item.partner_id}
                            orderStatus={item.order_status}
                        />
                        <View style={{ borderBottomColor: "#BBBBBB", borderBottomWidth: 1, marginTop: 20, marginHorizontal: 10 }}></View>
                    </View>
                )}
            />
        </View>
    )
}

export default OngoingOrdersScreen

