import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

const DeliveredProfile = (props) => {
    return (
        <View style={{ height: 100, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={props.image} style={styles.image} />
                <View>
                    <Text style={styles.text}>{props.name}</Text>
                    <Text style={{ color: "#464A29" }}>{props.time} ago</Text>
                </View>
            </View>
            <Text style={styles.text}>₹{props.earned}</Text>
        </View>
    )
}

export default DeliveredProfile

const styles = StyleSheet.create({
    image: {
        width: 60,
        height: 60,
        borderRadius: 20,
        marginRight: 10
    },
    text: {
        fontSize: 20,
        fontFamily: "MontserratSemiBold"
    }
})
