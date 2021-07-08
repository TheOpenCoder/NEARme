import React from 'react'
import { StyleSheet, Text, Pressable } from 'react-native'
import { Entypo } from '@expo/vector-icons';

const CollapseOption = (props) => {
    return (
        <Pressable
            style={styles.container}
            onPress={() => props.type === "show" ? props.state(true) : props.state(false)}>
            {props.type === "show" ? (
                <>
                    <Text style={styles.text}>Show all items</Text>
                    <Entypo name="chevron-down" size={24} color="black" />
                </>
            ) : (
                <>
                    <Text style={styles.text}>Hide items</Text>
                    <Entypo name="chevron-up" size={24} color="black" />
                </>
            )}

        </Pressable>
    )
}

export default CollapseOption

const styles = StyleSheet.create({
    text: {
        fontFamily: "MontserratSemiBold"
    },
    container: {
        width: '100%',
        justifyContent: "flex-end",
        flexDirection: "row",
        alignItems: "center"
    }
})
