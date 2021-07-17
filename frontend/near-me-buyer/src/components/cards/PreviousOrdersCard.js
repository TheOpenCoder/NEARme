import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

const PreviousOrdersCard = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.details}>
                <Image source={props.image} style={styles.image} />
                <View>
                    <Text style={styles.text}>{props.store}</Text>
                    <Text style={{ color: "#464A29" }}>{props.time} ago</Text>
                </View>
            </View>
            <Text style={styles.text}>₹{props.amount}</Text>
        </View>
    )
}

export default PreviousOrdersCard

const styles = StyleSheet.create({
    image: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 10
    },
    text: {
        fontSize: 20,
        fontFamily: "MontserratSemiBold"
    },
    container: {
        height: 100,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    details: {
        flexDirection: "row",
        alignItems: "center"
    }
})
