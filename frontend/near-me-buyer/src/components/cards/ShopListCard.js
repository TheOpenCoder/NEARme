import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { formatter, validator } from '../../helpers';

const ShopListCard = (props) => {

    const [isShopOpen, setIsShopOpen] = useState(false);


    useEffect(() => {

        if (validator.validateIfShopIsOpen(props.openingTime, props.closingTime)) {
            setIsShopOpen(true);
        } else {
            setIsShopOpen(false);
        }

    }, []);

    return (
        <Pressable style={styles.container} onPress={() => props.navigation.navigate("shopScreen", { name: props.name, sellerId: props.sellerId })}>
            <View style={{ flex: 1, paddingRight: 10 }}>
                <Image source={{uri: props.image}} style={styles.image} />
            </View>
            <View style={{ flex: 2 }}>
                <View style={styles.mainDetailsContainer}>
                    <View>
                        <Text numberOfLines={2} style={{ fontFamily: "MontserratMedium", fontSize: 16 }}>{props.name}</Text>
                        <Text numberOfLines={1} style={{ color: "#464A29" }}>{props.location}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, fontWeight: "600" }}>&#9733; {props.rating}</Text>
                    </View>
                </View>
                <View style={styles.shopTimingContainer}>
                    {isShopOpen ? (
                        <Text style={{ color: "#999999" }}>OPENED TILL {formatter.formatTimeTo12HoursStandard(props.closingTime.substring(0, 5))}, TODAY</Text>
                    ) : (
                        <Text style={{ color: "#999999" }}>OPENS AT {formatter.formatTimeTo12HoursStandard(props.openingTime.substring(0, 5))}, TODAY</Text>
                    )}

                </View>
            </View>
        </Pressable>
    )
}

export default ShopListCard

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 120,
        marginHorizontal: 10
    },
    image: {
        flex: 1,
        width: null,
        height: null,
        borderRadius: 10,
        resizeMode: "cover"
    },
    mainDetailsContainer: {
        flex: 2,
        paddingTop: 6,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    shopTimingContainer: {
        flex: 1,
        justifyContent: "flex-end",
        paddingBottom: 10
    }
})
