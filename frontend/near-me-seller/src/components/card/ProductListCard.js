import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Pressable } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useActionSheet } from '@expo/react-native-action-sheet';

const ProductListCard = (props) => {

    const { showActionSheetWithOptions } = useActionSheet();

    const onOpenActionSheet = () => {

        const options = ['Cancel', 'Hide', 'Delete'];

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex: 0,
                destructiveButtonIndex: 2,
                userInterfaceStyle: "dark",

            },
            buttonIndex => {
                switch (buttonIndex) {
                    case 1:
                        alert("clicked Hide")
                        break;
                    case 2:
                        alert("clicked Delete")
                        break;
                }
            },
        );
    };

    const { navigation, ...product } = props;


    return (
        <View style={{ flexDirection: "row", height: 120, marginHorizontal: 10 }}>
            <View style={{ flex: 1.2, marginRight: 10, position: "relative" }}>
                <Image source={{uri: props.image}} style={styles.image} />
            </View>
            <View style={{ flex: 2 }}>
                <Pressable style={{ flex: 2, paddingTop: 4 }}>
                    <Text numberOfLines={2} style={{ fontFamily: "MontserratMedium", fontSize: 16 }}>{props.name}</Text>
                    <Text numberOfLines={1} style={{ color: "#464A29" }}>Sports</Text>
                </Pressable>
                <View style={{ flex: 1.5, flexDirection: "row" }}>
                    <View style={{ flex: 4, justifyContent: "center"}}>
                        <Text style={{ fontFamily: "MontserratSemiBold", fontSize: 20 }}>₹{props.price}</Text>
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => navigation.navigate("AdScreen", {product})}>
                        <FontAwesome5 name="ad" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => onOpenActionSheet()}>
                            <MaterialIcons name="mode-edit" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default ProductListCard

const styles = StyleSheet.create({
    image: {
        flex: 1,
        width: null,
        height: null,
        borderRadius: 10,
        resizeMode: "cover"
    },
    bagIcon: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    wishlist: {
        backgroundColor: "#F3F3F5",
        width: 30,
        height: 30,
        borderRadius: 20,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        right: 5,
        top: 5
    },
    footer: {
        flex: 1.2,
        justifyContent: "flex-end",
        alignItems: "center",
        flexDirection: "row"
    }
})
