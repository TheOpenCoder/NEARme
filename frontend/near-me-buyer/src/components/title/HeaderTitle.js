import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const HeaderTitle = (props) => {


    return (
        <View style={{ flexDirection: "row" }}>
            <Text style={[styles.text, props.style && props.style]}>{props.name}</Text>
            {props.quantity && (
                <Text style={styles.quantityText}>{props.quantity}</Text>
            )}
        </View>
    )
}

export default HeaderTitle

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