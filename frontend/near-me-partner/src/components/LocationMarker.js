import React from 'react'
import { StyleSheet, View, Image } from 'react-native';

const LocationMarker = (props) => {
    return (
        <View style={{ position: "relative" }}>
            {props.type === "customer" ? (
                <>
                    <Image source={require('../../assets/images/location-pin.png')} style={styles.makerStyle} />
                    <Image source={require('../../assets/images/temp/profile1.png')} style={styles.markerImage} />
                </>
            ) : (
                <>
                    <Image source={require('../../assets/images/shop-location-pin.png')} style={styles.shopMakerStyle} />
                    <Image source={require('../../assets/images/temp/shop.png')} style={styles.shopMarkerImage} />
                </>
            )}
        </View>
    )
}

export default LocationMarker

const styles = StyleSheet.create({
    makerStyle: {
        width: 40,
        height: 40
    },
    markerImage: {
        width: 24,
        height: 24,
        borderRadius: 20,
        position: "absolute",
        top: 4,
        left: 8
    },
    shopMakerStyle: {
        width: 50,
        height: 50
    },
    shopMarkerImage: {
        width: 24,
        height: 24,
        borderRadius: 20,
        position: "absolute",
        top: 4,
        left: 12.5
    },
})
