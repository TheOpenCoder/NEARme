import React from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'

const Button = (props) => {
    return (
        props.type && props.type === "outline" ? (
            <Pressable style={[styles.container, props.style && props.style, { width: props.width, borderColor: "#BFBFBF" }]} onPress={() => props.onPress && props.onPress()} disabled={props.disable ? props.disable : false}>
                <Text style={[styles.text, { color: "black" }]}>{props.text}</Text>
            </Pressable>
        ) : (
            <Pressable style={[styles.container, props.style && props.style, { width: props.width, backgroundColor: "black" }]} onPress={() => props.onPress && props.onPress()} disabled={props.disable ? props.disable : false}>
                <Text style={[styles.text, { color: "white" }]}>{props.text}</Text>
            </Pressable>
        )

    )
}

export default Button

const styles = StyleSheet.create({
    container: {
        padding: 18,
        borderRadius: 13,
        alignItems: "center",
        borderWidth: 2
    },
    text: {
        fontFamily: "MontserratSemiBold",
        fontSize: 16
    }
})
