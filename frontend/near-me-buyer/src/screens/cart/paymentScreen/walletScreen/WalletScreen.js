import React, { useState } from 'react'
import { Keyboard, View, TouchableWithoutFeedback, Text } from 'react-native';
import { TextInput as PaperTextInput, HelperText } from 'react-native-paper';
import { formatter, validator } from '../../../../helpers';
import Button from '../../../../components/basic/Button';
import { Entypo } from '@expo/vector-icons';

import SubHeading from '../../../../components/title/SubHeading';
import OptionCard from '../../../../components/cards/OptionCard';
import Alerter from '../../../../components/Alerter';
import { useDispatch, useSelector } from 'react-redux';
import { alertActions } from '../../../../redux/actions';
import { rapydServices } from '../../../../services';

const WalletScreen = ({ navigation, totalPrice }) => {

    const [addMoney, setAddMoney] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const walletData = useSelector(state => state.wallet.walletDetails.currentWallet);
    const verification_status = useSelector(state => state.wallet.walletDetails.wallet.verification_status);


    const createCheckoutData = async () => {

        const countryDetails = await rapydServices.getCurrency(user.country_code);
        const checkData = {
            "country": user.country_code,
            "currency": countryDetails.currency_code,
            "customer": user.customer_id,
            "ewallet": user.wallet_id,
            "payment_method_type_categories": ["card"],
            "language": "en"
        }
        return checkData
    }


    const handleAddAmount = async () => {
        setSubmitted(true);
        if(addMoney){
            const walletTopupData = await createCheckoutData();
            rapydServices.createCheckOutPage(walletTopupData)
            .then(
                res => {
                    setLoading(false);
                    navigation.navigate("RapydPaymentScreen", {checkout_id: res.id, type: "topup"});
                },
                err => {
                    dispatch(alertActions.error(err.toString()));
                    setLoading(false);
                }
            )
        }
    }

    const getWalletAmount = () => {
        return walletData && (walletData.length > 0 ? walletData[0].balance : 0)
    }


    if(user.kyc_verified && verification_status === "not verified"){
        return (
            <>
             <SubHeading name="Wallet" />
            <View style={{flex: 1, backgroundColor: "#E5E5E5", alignItems: "center", justifyContent: "center"}}>
                <Text style={{fontSize: 24}}>Your Kyc is under process</Text>
            </View>
            </>
        )
    }


    return (
        <>
            <Alerter />
            <TouchableWithoutFeedback style={{ marginTop: 20, flex: 1, backgroundColor: "red" }} onPress={Keyboard.dismiss}>
                <View>
                    <SubHeading name="Wallet" />
                    <View style={{ paddingHorizontal: 20 }}>
                        <OptionCard
                            title={`Available Balance: ₹${getWalletAmount()}`}
                            subtitle={getWalletAmount() > totalPrice ? "Balance available to proceed" : `Need ₹${totalPrice - getWalletAmount()} more to proceed`}
                            image={<Entypo name="wallet" size={30} color="#617CBF" />}
                            onPress={() => {
                                if (getWalletAmount() > totalPrice) {
                                    navigation.navigate("BuyScreen", {
                                        paymentType: "Wallet",
                                        paymentDetail: `Available Balance: ₹${getWalletAmount()}`,
                                        PaymentImage: <Entypo name="wallet" size={30} color="#617CBF" />
                                    })
                                } else {
                                    dispatch(alertActions.error(`Need ₹${totalPrice - getWalletAmount()} more to proceed`));
                                }
                            }}
                        />
                    </View>
                    <SubHeading name="Add Money" />
                    <View style={{ paddingHorizontal: 20 }}>
                        <PaperTextInput
                            label="₹ AMOUNT"
                            value={addMoney}
                            onChangeText={(value) => setAddMoney(formatter.formatWalletAddMoney(value))}
                            selectionColor="#464A29"
                            underlineColor="#BBBBBB"
                            keyboardType="decimal-pad"
                            keyboardAppearance="dark"
                            style={{ fontSize: 24, fontWeight: "bold" }}
                            error={!validator.validateNotNull(submitted, addMoney)}
                        />

                        <HelperText type="error" visible={!validator.validateNotNull(submitted, addMoney)} style={{ marginBottom: 10 }}>
                            Amount should not be empty!
                        </HelperText>
                        <Button text="Add Money" onPress={() => handleAddAmount()} />
                    </View>

                </View>
            </TouchableWithoutFeedback>
        </>
    )
}

export default WalletScreen

