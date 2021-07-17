import React, { useState, useEffect, useCallback } from 'react'
import { View, RefreshControl, FlatList, Text } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useDispatch, useSelector } from 'react-redux';

//components
import HeaderTitle from '../../../components/title/HeaderTitle';
import DeliveryInfoCard from '../../../components/card/DeliveryInfoCard';
import LoadingScreen from '../../../components/LoadingScreen';
import WalletSyncModal from '../../../components/WalletSyncModal';
import { deliveryActions } from '../../../redux/actions/deliveryActions';


const DeliveryRequest = ({ navigation }) => {


    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();
    const loading = useSelector(state => state.delivery.loading);
    const userAddress = useSelector(state => state.location.userAddress);
    const deliveries = useSelector(state => state.delivery.deliveries);
    const partnerId = useSelector(state => state.auth.partner.id);


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        Haptics.selectionAsync()

        setTimeout(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            setRefreshing(false);
        }, 2000)

    }, []);

    useEffect(() => {
        dispatch(deliveryActions.getDeliveryRequests(partnerId));
    }, []);



    if (loading) {
        return (
            <LoadingScreen />
        )
    }

    if (!deliveries) {
        return (
            <View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#E5E5E5"}}>
                <Text>Currently No Deliveries</Text>
            </View>
        )
    }

    return (
        <>
            <WalletSyncModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
            <FlatList
                data={deliveries}
                keyExtractor={item => item.order_id}
                showsVerticalScrollIndicator={false}
                style={{ backgroundColor: "#E5E5E5", paddingTop: 20 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['white']}
                        enabled
                        progressBackgroundColor="black"
                        tintColor="black"
                    />}
                ListHeaderComponent={() => {
                    return (
                        <View style={{ alignItems: "center" }}>
                            <HeaderTitle name={userAddress ? `Deliveries near ${userAddress[0].name}` : "Deliveries near you"} style={{ fontSize: 22, marginBottom: 10, color: "#707070", textAlign: "center" }} />
                            <Entypo name="chevron-thin-down" size={24} color="#707070" style={{ marginBottom: 10 }} />
                        </View>
                    )
                }}
                renderItem={({ item }) => (
                    <DeliveryInfoCard
                        key={item.id}
                        latitude={item.user_lat}
                        longitude={item.user_long}
                        customerName={item.user_name}
                        time="1 min"
                        earning="32"
                        shopName={item.seller_name}
                        customerImage={item.user_image}
                        shopImage={require('../../../../assets/images/temp/shop.png')}
                        customerCoordinate={{ latitude: item.user_lat, longitude: item.user_long }}
                        shopCoordinate={{ latitude: item.seller_lat, longitude: item.seller_long }}
                        navigation={navigation}
                        orderId={item.id}
                        sellerId={item.seller_id}
                        userId={item.user_id}
                        partnerId={partnerId}
                    />
                )}
            />
        </>
    )
}

export default DeliveryRequest

