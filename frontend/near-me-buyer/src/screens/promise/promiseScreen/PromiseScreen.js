import React, { useCallback, useState } from 'react'
import { View, Text, FlatList, RefreshControl, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as Haptics from 'expo-haptics';

//components
import KycCommonScreen from '../../common/kycScreen/KycCommonScreen';
import PromiseCard from '../../../components/cards/PromiseCard';
import RepayCard from '../../../components/cards/RepayCard';
import WalletSyncScreen from '../../common/walletSyncScreen/WalletSyncScreen';
import { promiseData } from '../../../menus';
import { useSelector } from 'react-redux';


const PromiseScreen = ({ navigation }) => {

    const [refreshing, setRefreshing] = useState(false);
    const user = useSelector(state => state.auth.user);
    const verification_status = useSelector(state => state.wallet.walletDetails.wallet.verification_status);


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        Haptics.selectionAsync()

        setTimeout(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            setRefreshing(false);
        }, 2000)

    }, []);


    const checkRepayData = (promiseData) => {
        return promiseData.type === "repay"
    }


    if (promiseData.length === 0) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#E5E5E5" }}>
                <Text style={{ fontFamily: "MontserratSemiBold", fontSize: 20 }}>Promise is Empty</Text>
            </View>

        )
    }

    if(user.kyc_verified && verification_status === "not verified"){
        return (
            <View style={{flex: 1, backgroundColor: "#E5E5E5", alignItems: "center", justifyContent: "center"}}>
                <Text style={{fontSize: 24}}>Your Kyc is under process</Text>
            </View>
        )
    }

    return (
        (user.kyc_verified && verification_status === "verified") ? (
            <View style={{ backgroundColor: "#E5E5E5", flex: 1, paddingTop: 8 }}>
                <FlatList
                    data={promiseData}
                    ListHeaderComponent={() => <RepayCard data={promiseData.filter(checkRepayData)} navigation={navigation} />}
                    keyExtractor={item => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['white']}
                            enabled
                            progressBackgroundColor="black"
                            tintColor="black"
                        />}
                    renderItem={({ item }) => (
                        <PromiseCard
                            type={item.type}
                            profile={item.profile}
                            data={item.data}
                        />
                    )}
                />
            </View>
        ) : (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <ScrollView style={{ backgroundColor: "#E5E5E5" }} showsVerticalScrollIndicator={false}>
                <Text style={{ color: "black", fontFamily: "IBMMedium", marginTop: 4, paddingHorizontal: 20 }}>Promise is one of the features of NEARme which lets you borrow or lend money to someone</Text>
                    <KycCommonScreen />
                </ScrollView>
            </TouchableWithoutFeedback>
        )

    )
}

export default PromiseScreen