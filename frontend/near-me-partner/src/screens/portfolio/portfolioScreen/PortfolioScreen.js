import React from 'react'
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import HeaderTitle from '../../../components/title/HeaderTitle';
import Button from '../../../components/Button';
import { useNavigation } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
import { LocalAuthenticator } from '../../../helpers/localAuthenticator';

const PortfolioScreen = () => {

    const navigation = useNavigation();

    const handleWithdraw = () => {

        LocalAuthenticator()
            .then(
                res => {
                    if (res) {
                        navigation.navigate("WithdrawScreen");
                    } else {
                        console.log("FINNALY" + res);
                    }
                }
            )


    }

    return (
        <View style={{ flex: 1, backgroundColor: "#E5E5E5" }}>

            <View style={{ height: 200, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 36, fontFamily: "MontserratSemiBold" }}>₹24522</Text>
                <Text style={{ fontSize: 18, color: "#464A29" }}>Money earned this month</Text>
            </View>

            <View style={{ flex: 1.4, justifyContent: "flex-end", marginBottom: 10 }}>
                <View style={{ backgroundColor: "#F5F5F5", padding: 20, marginHorizontal: 10, borderRadius: 20, }}>
                    <LinearGradient
                        colors={['#888888', '#707070', '#4F4F4F']}
                        style={{ backgroundColor: "#869FDD", height: 200, borderRadius: 20, padding: 10 }}>
                        <View style={{ flex: 4, justifyContent: "center", marginLeft: 20 }}>
                            <HeaderTitle name="Wallet Balance" style={{ color: "#E5E5E5", fontSize: 22 }} />
                            <Text style={{ fontFamily: "NunitoBold", fontSize: 40, marginTop: 5, color: "white" }}>
                                <Text>24522 </Text>
                                <Text style={{ fontSize: 22, color: "#E5E5E5" }}> INR</Text>
                            </Text>
                        </View>
                        <View style={{ flex: 1, alignItems: "flex-end", paddingHorizontal: 10 }}>
                            <Text style={{ fontFamily: "MontserratMedium", fontSize: 18, marginTop: 5, color: "white" }}>near wallet</Text>
                        </View>
                    </LinearGradient>

                    <Button text="Withdraw Money" style={{ marginTop: 20 }} onPress={() => handleWithdraw()} />
                </View>
            </View>
        </View>
    )
}

export default PortfolioScreen

const styles = StyleSheet.create({})
