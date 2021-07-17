import React from 'react'
import { StyleSheet, Text, View } from 'react-native';


const PriceTag = (props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>₹{props.price}</Text>
            {props.icon}
        </View>
    )
}

export default PriceTag

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F5F5F5",
        flexDirection: "row",
        width: 90,
        height: '94%',
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 8,
        borderRadius: 10
    },
    text: {
        fontFamily: "MontserratSemiBold",
        fontSize: 14
    }
})
