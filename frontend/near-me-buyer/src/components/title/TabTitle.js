import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const TabTitle = (props) => {


    return (
        <View style={{ flexDirection: "row", marginTop: 20 }}>
            <Text style={[styles.text, !props.isFocused && { color: "#ADADAD" }]}>{props.name}</Text>
            {props.quantity && (
                <Text style={[styles.quantityText, !props.isFocused && { color: "#ADADAD" }]}>{props.quantity}</Text>
            )}
        </View>
    )
}

export default TabTitle

const styles = StyleSheet.create({
    text: {
        fontFamily: 'MontserratSemiBold',
        fontSize: 30
    },
    quantityText: {
        fontFamily: 'MontserratSemiBold',
        fontSize: 18,
        marginLeft: 2
    }
})