import React, { useRef, useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import LocationMarker from '../LocationMarker';
import MapCallOutView from '../MapCallOutView';
import LoadingScreen from '../LoadingScreen';
import { deliveryServices } from '../../services';

import Button from '../Button';
const LATITUDE_DELTA = 0.09;
const LONGITUDE_DELTA = 0.09;

const DeliveryInfoCard = (props) => {

    const [mapLoaded, setMapLoaded] = useState(false);

    const mapRef = useRef(null);

    useEffect(() => {
        const animationTimeout = setTimeout(() => {
            if (mapRef.current) {
                mapRef.current.fitToSuppliedMarkers(["customerMarker", "shopMarker"], false);
            }
        }, 1000);

        return () => {
            if (animationTimeout) {
                clearTimeout(animationTimeout);
            }
        };

    }, [mapLoaded]);

    const handleAcceptRequest = () => {
        deliveryServices.acceptDelivery(props.partnerId, {"order_id": props.orderId})
        .then(
            () => {
                props.navigation.replace("DeliveryDirection", { props })
            }
        )
    }





    if (!props.latitude) {
        return null;
    }

    if (!mapLoaded) {
        <LoadingScreen />
    }

    return (
        <View>
            <View style={{ height: 100, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1.8 }}>
                    <Image source={{uri: props.customerImage}} style={styles.image} />
                    <View style={{flex: 1}}>
                        <Text numberOfLines={1} style={styles.text}>{props.customerName}</Text>
                        <Text style={{ color: "#464A29" }}>{props.time} ago</Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.text, { fontSize: 18, fontFamily: "MontserratMedium", textAlign: "right" }]}>Delivery rate</Text>
                    <Text style={[{ color: "#464A29", textAlign: "right" }, styles.text]}>₹{props.earning}</Text>
                </View>
            </View>
            <View style={{ marginHorizontal: 20, borderRadius: 20 }}>
                <MapView
                    ref={ref => mapRef.current = ref}
                    showsUserLocation
                    showsBuildings
                    onMapReady={() => setMapLoaded(true)}
                    // provider={PROVIDER_GOOGLE}
                    style={{ width: '100%', height: 180, borderRadius: 20 }}
                    initialRegion={{
                        latitude: props.latitude,
                        longitude: props.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                >

                    {/* customer marker */}
                    <Marker coordinate={props.customerCoordinate} identifier="customerMarker">
                        <LocationMarker
                            type="customer"
                            image={props.customerImage}
                        />
                        <Callout tooltip>
                            <MapCallOutView
                                image={props.customerImage}
                                title={props.customerName}
                            />
                        </Callout>
                    </Marker>

                    {/* shopMarker */}
                    <Marker coordinate={props.shopCoordinate} identifier="shopMarker">
                        <LocationMarker
                            type="shop"
                            image={props.shopImage}
                        />
                        <Callout tooltip>
                            <MapCallOutView
                                image={props.shopImage}
                                title={props.shopName}
                                subTitle={props.closingTime}
                            />
                        </Callout>
                    </Marker>
                </MapView>
            </View>
            <Button text="Accept" style={{ marginHorizontal: 20, marginVertical: 20 }} onPress={() => handleAcceptRequest()} />
            <View style={{ borderBottomColor: "#BBBBBB", borderBottomWidth: 1, marginHorizontal: 10, marginBottom: 20 }}></View>
        </View>
    )
}

export default DeliveryInfoCard

const styles = StyleSheet.create({
    image: {
        width: 60,
        height: 60,
        borderRadius: 20,
        marginRight: 10
    },
    text: {
        fontSize: 20,
        fontFamily: "MontserratSemiBold"
    }
})
