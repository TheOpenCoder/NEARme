import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import OrderList from './OrderList';
import CollapseOption from '../CollapseOption';
import Button from '../Button';

const OrdersCard = (props) => {

    const [isOrderCardExpanded, setIsOrderCardExpanded] = useState(false);
    const [readyToDeliver, setReadyToDeliver] = useState(false);


    return (
        <View style={{ flex: 1 }}>
            <View style={{ paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center", flex: 2 }}>
                    <Image source={{uri: props.userImage}} style={[styles.image, { flex: 1 }]} />
                    <View style={{ flex: 2.5 }}>
                        <Text numberOfLines={1} style={styles.text}>{props.name}</Text>
                        <Text style={{ color: "#464A29" }}>{props.time}</Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[{ color: "#464A29", textAlign: "right" }, styles.text]}>₹{props.totalPrice}</Text>
                </View>
            </View>
            <View style={{ alignItems: "center", padding: 20 }}>
                <>
                    {props.products && props.products.slice(0, 2).map((item) => (
                        <OrderList
                            name={item.name}
                            price={item.price}
                            image={item.image}
                            quantity={item.quantity}
                            productId={item.id}
                        />
                    ))}
                </>
                <>
                    {props.products && props.products.length > 2 && (
                        <>
                            {!isOrderCardExpanded ? (
                                <CollapseOption type="show" state={setIsOrderCardExpanded} />
                            ) : (
                                <>
                                    <>
                                        {props.products && props.products.slice(2).map((item) => (
                                            <OrderList
                                                name={item.name}
                                                price={item.price}
                                                image={item.image}
                                                quantity={item.quantity}
                                                productId={item.id}
                                            />
                                        ))}
                                    </>
                                    <>
                                        {isOrderCardExpanded && (
                                            <CollapseOption type="hide" state={setIsOrderCardExpanded} />
                                        )}
                                    </>
                                </>
                            )}
                        </>
                    )}
                </>
            </View>
            <View>
                <Text style={[styles.boldText, {fontSize: 18, marginLeft: 20}]}>
                <Text style={{color: "#464A29"}}>Order Status: </Text>
                <Text style={{textTransform: "uppercase"}}>{props.orderStatus}</Text>
                </Text>
            </View>
        </View>

    )
}

export default OrdersCard

const styles = StyleSheet.create({
    image: {
        width: 60,
        height: 60,
        borderRadius: 20,
        marginRight: 10,
    },
    text: {
        fontSize: 20,
        fontFamily: "MontserratSemiBold"
    },
    orderIdContainer: {
        backgroundColor: "#F5F5F5",
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        borderRadius: 10
    },
    orderIdText: {
        color: "#6C6C6C",
        position: "absolute",
        left: 20,
        fontFamily: "MontserratSemiBold"
    },
    lineSeperator: {
        borderBottomColor: "#BBBBBB",
        borderBottomWidth: 1,
        marginTop: 20,
        marginHorizontal: 10
    },
    boldText: {
        fontSize: 30,
        fontFamily: "MontserratSemiBold"
    },
    ButtonContainer: {
        marginHorizontal: 20,
        flexDirection: "row"
    }
})
