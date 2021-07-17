import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';


const OptionCard = (props) => {

    return (
        <TouchableOpacity style={styles.container} onPress={() => props.onPress && props.onPress()}>
            <View style={styles.imageContainer}>
                {props.image}
            </View>
            <View style={{ flex: 10 }}>
                <Text numberOfLines={1} style={styles.text}>{props.title}</Text>
                <Text numberOfLines={1} style={[styles.text, { color: "#6E6E6E" }]}>{props.subtitle}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Entypo name="chevron-right" size={24} color="black" />
            </View>
        </TouchableOpacity>
    )
}

export default OptionCard

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        marginHorizontal: 10,
    },
    text: {
        fontWeight: "700"
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 20,
        marginRight: 6,
        marginLeft: 2,
    },
    imageContainer: {
        backgroundColor: "#F5F5F5",
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginRight: 10
    }
})
