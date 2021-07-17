import React from 'react'
import { View } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


import SubHeading from '../../../../components/title/SubHeading';
import OptionCard from '../../../../components/cards/OptionCard';

const CardScreen = ({ navigation }) => {

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: "#E5E5E5", paddingTop: 20 }}
            showsVerticalScrollIndicator={false}
        >
            <SubHeading name="Card / Banking" />
            <View style={{ paddingHorizontal: 20, marginBottom: 70 }}>
                <OptionCard
                    title="Credit / Debit Card"
                    subtitle="Powered by Rapyd"
                    image={<Ionicons name="ios-card" size={30} color="#617CBF" />}
                    onPress={() => navigation.navigate("BuyScreen", {
                        paymentType: "Card / Banking",
                        paymentDetail: "Powered by Rapyd",
                        PaymentImage: <Ionicons name="ios-card" size={30} color="#617CBF" />
                    })}
                />
                <OptionCard
                    title="Bank Transfer"
                    subtitle="Powered by Rapyd"
                    image={<MaterialCommunityIcons name="bank-transfer" size={36} color="#617CBF" />}
                    onPress={() => navigation.navigate("BuyScreen", {
                        paymentType: "Bank Transfer",
                        paymentDetail: "Powered by Rapyd",
                        PaymentImage: <MaterialCommunityIcons name="bank-transfer" size={36} color="#617CBF" />
                    })}
                />
                <OptionCard
                    title="Bank Redirect"
                    subtitle="Powered by Rapyd"
                    image={<FontAwesome name="bank" size={24} color="#617CBF" />}
                    onPress={() => navigation.navigate("BuyScreen", {
                        paymentType: "Bank Redirect",
                        paymentDetail: "Powered by Rapyd",
                        PaymentImage: <FontAwesome name="bank" size={24} color="#617CBF" />
                    })}
                />
            </View>
        </KeyboardAwareScrollView>
    )
}

export default CardScreen
