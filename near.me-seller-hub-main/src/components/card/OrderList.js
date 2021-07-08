import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

const OrderList = (props) => {
    return (
        <View style={{ flexDirection: "row", marginVertical: 10 }}>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text style={styles.text}>{props.quantity} x</Text>
            </View>
            <View style={{ flexDirection: "row", flex: 4.2 }}>
                <Image source={{uri: props.image}} style={styles.image} />
                <View style={{ justifyContent: "center", flex: 1 }}>
                    <Text numberOfLines={1} style={{ fontFamily: "MontserratMedium" }}>{props.name}</Text>
                    <Text style={[styles.text, { color: "#464A29" }]}>₹{props.price}</Text>
                </View>
            </View>
        </View>
    )
}

export default OrderList

const styles = StyleSheet.create({
    image: {
        width: 60,
        height: 60,
        borderRadius: 20,
        marginRight: 10,
    },
    text: {
        fontSize: 20,
        fontFamily: "MontserratSemiBold"
    }
})
