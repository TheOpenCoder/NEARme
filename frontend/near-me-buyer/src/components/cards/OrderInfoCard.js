import React from 'react'
import { Text, View } from 'react-native'

const OrderInfoCard = (props) => {

    const PriceList = (props) => {
        return (
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 2 }}>
                <Text style={{ fontFamily: "MontserratSemiBold", color: "#B0B0B0" }}>{props.title}</Text>
                <Text style={{ fontFamily: "MontserratSemiBold" }}>₹{props.price}</Text>
            </View>
        )
    }

    return (
        <>
            <View style={{ marginHorizontal: 10, marginTop: 10, backgroundColor: "#F3F3F5", padding: 10, borderRadius: 10 }}>
                <Text style={{ fontFamily: "MontserratSemiBold", fontSize: 22, marginBottom: 10 }}>Order Info</Text>
                <PriceList
                    title="Subtotal"
                    price={props.subtotal}
                />
                <PriceList
                    title="Delivery charge"
                    price={props.deliveryCharge}
                />
                <View style={{ marginVertical: 8, borderTopColor: "#BBBBBB", borderTopWidth: 1, paddingTop: 6 }}>
                    <PriceList
                        title="Subtotal"
                        price={props.subtotal + props.deliveryCharge}
                    />
                </View>
            </View>
        </>
    )
}

export default OrderInfoCard


