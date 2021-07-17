import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import LoadingScreen from '../../../components/LoadingScreen';
import LocationMarker from '../../../components/LocationMarker';
import MapCallOutView from '../../../components/MapCallOutView';
import HeaderTitle from '../../../components/title/HeaderTitle';
import Button from '../../../components/Button';
import { deliveryServices } from '../../../services';
import {GOOGLE_MAPS_API_TOKEN} from "@env"  //CHANGE_TO_YOUR_API_KEY_IN_ENV_FILE

const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;

const DeliveryDirection = ({ route, navigation }) => {

    const { props } = route.params;

    const [mapLoaded, setMapLoaded] = useState(false);
    const [packageReceived, setPackageReceived] = useState(false);
    const mapRef = useRef(null);


    useEffect(() => {

        if (mapRef.current) {
            mapRef.current.fitToSuppliedMarkers(["customerMarker", "shopMarker"], false);
        }

    }, [mapLoaded]);


    const handlePackageReceived = () => {
        deliveryServices.receivePackage(props.partnerId, {"order_id": props.orderId})
        .then(
            () => {
                setPackageReceived(true);
            }
        ),
        err => console.log(err);
    }

    const handlePackageDelivered = () => {
        deliveryServices.deliverPackage(props.partnerId, {"order_id": props.orderId})
        .then(
            () => {
                navigation.replace("DeliveryRequest");
            }
        ),
        err => console.log(err);
    }


    if (!props.latitude) {
        return null;
    }

    if (!mapLoaded) {
        <LoadingScreen />
    }


    return (
        <View style={{ backgroundColor: "#E5E5E5", flex: 1, position: "relative" }}>
            <MapView
                mapPadding={{ top: 100, right: 150, bottom: 100, left: 150 }}
                ref={ref => mapRef.current = ref}
                showsUserLocation
                showsBuildings
                onMapReady={() => setMapLoaded(true)}
                style={{ width: '100%', height: '100%' }}
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
                            subTitle="9:00 PM"
                        />
                    </Callout>
                </Marker>
                {!packageReceived ? (
                <MapViewDirections
                    origin={props.customerCoordinate}
                    destination={props.shopCoordinate}
                    apikey={GOOGLE_MAPS_API_TOKEN} //CHANGE_TO_YOUR_API_KEY_IN_ENV_FILE
                    strokeWidth={3}
                    strokeColor="hotpink"
                />
                ): (
                     <MapViewDirections
                    origin={props.shopCoordinate}
                    destination={props.customerCoordinate}
                    apikey={GOOGLE_MAPS_API_TOKEN} //CHANGE_TO_YOUR_API_KEY_IN_ENV_FILE
                    strokeWidth={3}
                    strokeColor="hotpink"
                />
                )}
            </MapView>
            <SafeAreaView style={{ position: "absolute", left: 20 }}>
                <HeaderTitle name="Direction" />
            </SafeAreaView>
            {!packageReceived ? (
                <SafeAreaView style={{ position: "absolute", bottom: 0, width: '100%', alignItems: "center" }}>
                    <View style={styles.orderIdContainer}>
                        <Text style={styles.orderIdText}>Order Id:</Text>
                        <Text style={styles.boldText}>#4325</Text>
                    </View>
                    <Button text="Received Package" width="94%" onPress={() => handlePackageReceived()} />
                </SafeAreaView>
            ) : (
                <SafeAreaView style={{ position: "absolute", bottom: 0, width: '100%', alignItems: "center" }}>
                    <Button text="Delivered" width="94%" onPress={() => handlePackageDelivered()} />
                </SafeAreaView>
            )}

        </View>
    )
}

export default DeliveryDirection

const styles = StyleSheet.create({
    orderIdContainer: {
        backgroundColor: "#F5F5F5",
        marginHorizontal: 20,
        marginBottom: 10,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 10,
        width: '50%',
        alignSelf: "flex-end",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4.65,

        elevation: 8,
    },
    orderIdText: {
        color: "#6C6C6C",
        fontFamily: "MontserratSemiBold"
    },
    boldText: {
        fontSize: 26,
        fontFamily: "MontserratSemiBold"
    },
})
