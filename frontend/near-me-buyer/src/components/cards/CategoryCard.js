import React from 'react'
import { StyleSheet, Text, View } from 'react-native';

const CategoryCard = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                {props.icon}
            </View>
            <Text style={styles.title}>{props.name}</Text>
        </View>
    )
}

export default CategoryCard

const styles = StyleSheet.create({
    iconContainer: {
        backgroundColor: "#F3F3F5",
        width: 70,
        height: 70,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 60
    },
    container: {
        alignItems: "center"
    },
    title: {
        fontFamily: "MontserratSemiBold",
        marginTop: 4
    }
})
