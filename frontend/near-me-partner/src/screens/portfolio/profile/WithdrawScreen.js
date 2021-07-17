import React, { useState } from 'react'
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { formatter, validator } from '../../../helpers'
import { TextInput as PaperTextInput, HelperText } from 'react-native-paper';


import Button from '../../../components/Button';
import HeaderTitle from '../../../components/title/HeaderTitle';
import OptionCard from '../../../components/card/OptionCard';

const WithdrawScreen = ({ navigation }) => {


    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cardHolder, setCardHolder] = useState("");
    const [cvv, setCvv] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleAddCard = () => {
        setSubmitted(true);
    }


    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: "#E5E5E5", paddingTop: 20 }}
            showsVerticalScrollIndicator={false}
        >
            <View style={{ paddingHorizontal: 20, marginBottom: 70 }}>
                <HeaderTitle name="Saved Cards" style={{ marginBottom: 10, marginTop: 20, fontSize: 26 }} />
                <OptionCard
                    title="Master Card"
                    subtitle="5564-XXXXXXXX-5280"
                    image={<Ionicons name="ios-card" size={30} color="#617CBF" />}
                    onPress={() => navigation.navigate("BuyScreen", {
                        paymentType: "Master Card",
                        paymentDetail: "5564-XXXXXXXX-5280",
                        PaymentImage: require('../../../../assets/images/card.png')
                    })}
                />
                <OptionCard
                    title="Visa card"
                    subtitle="6020-XXXXXXXX-9210"
                    image={<Ionicons name="ios-card" size={30} color="#617CBF" />}
                    onPress={() => navigation.navigate("BuyScreen", {
                        paymentType: "Visa card",
                        paymentDetail: "6020-XXXXXXXX-9210",
                        PaymentImage: require('../../../../assets/images/card.png')
                    })}
                />
                <HeaderTitle name="Add New Card" style={{ marginTop: 20, marginBottom: 10, fontSize: 26 }} />

                <View>
                    <PaperTextInput
                        label="Enter Card Number"
                        value={cardNumber}
                        onChangeText={(value) => setCardNumber(formatter.formatCardNumber(value))}
                        selectionColor="#464A29"
                        underlineColor="#BBBBBB"
                        keyboardType="number-pad"
                        keyboardAppearance="dark"
                        error={!validator.validateCardNumber(submitted, cardNumber)}
                    />
                    <HelperText type="error" visible={!validator.validateCardNumber(submitted, cardNumber)}>
                        Enter valid Card Number!
                    </HelperText>
                </View>

                <View>
                    <PaperTextInput
                        label="Enter Name"
                        value={cardHolder}
                        onChangeText={setCardHolder}
                        selectionColor="#464A29"
                        underlineColor="#BBBBBB"
                        keyboardAppearance="dark"
                        error={!validator.validateNotNull(submitted, cardHolder)}
                    />

                    <HelperText type="error" visible={!validator.validateNotNull(submitted, cardHolder)}>
                        Name is required!
                    </HelperText>
                </View>

                <View>
                    <PaperTextInput
                        label="Enter Expiry Date"
                        value={expiryDate}
                        onChangeText={(value) => setExpiryDate(formatter.formatExpiryDate(value))}
                        selectionColor="#464A29"
                        underlineColor="#BBBBBB"
                        keyboardType="number-pad"
                        keyboardAppearance="dark"
                        error={!validator.validateExpiryDate(submitted, expiryDate)}
                    />
                    <HelperText type="error" visible={!validator.validateExpiryDate(submitted, expiryDate)}>
                        Enter valid Expiry Date!
                    </HelperText>
                </View>

                <View>
                    <PaperTextInput
                        label="Enter Cvv Number"
                        value={cvv}
                        onChangeText={(value) => (setCvv(formatter.formatCvv(value)))}
                        selectionColor="#464A29"
                        underlineColor="#BBBBBB"
                        keyboardType="number-pad"
                        keyboardAppearance="dark"
                        error={!validator.validateCvv(submitted, cvv)}
                    />
                    <HelperText type="error" visible={!validator.validateCvv(submitted, cvv)}>
                        Enter valid CVV!
                    </HelperText>
                </View>


                <Text style={{ color: "#464A29", marginVertical: 10, marginBottom: 30 }}>We save this card for you convenience. We don't store CVV</Text>
                <Button text="Add Card" onPress={() => handleAddCard()} />

            </View>
        </KeyboardAwareScrollView>
    )
}

export default WithdrawScreen
