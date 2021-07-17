import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const AvatarTextCard = (props) => {
    return (
        <View style={[styles.container, { width: props.size, height: props.size }]}>
            <Text style={styles.Text}>{props.name.substring(0, 2).toUpperCase()}</Text>
        </View>
    )
}

export default AvatarTextCard

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F5F5F5",
        borderRadius: 200,
        alignItems: "center",
        justifyContent: "center"
    },
    Text: {
        fontFamily: "MontserratSemiBold",
        fontSize: 40
    }
})
