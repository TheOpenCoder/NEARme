import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native';

import SubHeading from '../../../../components/title/SubHeading';
import Button from '../../../../components/basic/Button';

const BorrowScreen = ({ navigation, totalPrice }) => {
    return (
        <View style={styles.container}>
            <SubHeading name="Borrow and pay" />
            <View style={styles.spacer}>
                <Button text={`Borrow (₹${totalPrice})`} onPress={() => navigation.navigate("BuyScreen", {
                    paymentType: "Borrow",
                    paymentDetail: "₹14 will be charged per day",
                    PaymentImage:  <Image source={require('../../../../../assets/images/borrow.png')} style={{ width: 26, height: 26 }} />
                })} />
                <Text style={styles.text}>
                    <Text>An interest of</Text>
                    <Text style={styles.highlight}> ₹14 </Text>
                    <Text>will be charged everyday</Text>
                </Text>
            </View>
        </View>
    )
}

export default BorrowScreen

const styles = StyleSheet.create({
    container: {
        marginTop: 20
    },
    spacer: {
        paddingHorizontal: 20,
        marginTop: 20
    },
    text: {
        fontSize: 18,
        fontFamily: "MontserratMedium",
        marginTop: 20
    },
    highlight: {
        fontSize: 24,
        color: "#752525"
    }
})
