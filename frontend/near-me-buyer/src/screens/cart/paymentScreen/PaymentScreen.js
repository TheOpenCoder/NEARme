import React, { useState } from 'react';
import { View } from 'react-native';
import PaymentModal from '../../../components/PaymentModal';


//import screens
import CardScreen from './cardScreen/CardScreen';
import WalletScreen from './walletScreen/WalletScreen';
import BorrowScreen from './borrowScreen/BorrowScreen';

const PaymentScreen = ({ navigation, route }) => {

    const [paymentOption, setPaymentOption] = useState("card");
    const { totalPrice } = route.params;

    return (
        <View style={{ flex: 1, backgroundColor: "#E5E5E5" }}>
            {paymentOption === "card" ? (
                <CardScreen
                    navigation={navigation}
                />
            ) : paymentOption === "wallet" ? (
                <WalletScreen
                    navigation={navigation}
                    totalPrice={totalPrice}
                />
            ) : (
                <BorrowScreen
                    navigation={navigation}
                    totalPrice={totalPrice}
                />
            )}
            <PaymentModal
                paymentOption={paymentOption}
                setPaymentOption={setPaymentOption}
            />
        </View>
    )
}

export default PaymentScreen

