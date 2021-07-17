import React, { useRef, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Pressable, Image } from 'react-native'
import BottomSheet from 'reanimated-bottom-sheet';
import { Ionicons, Entypo } from '@expo/vector-icons';
import PriceTag from './PriceTag';
import { useSelector, useDispatch } from 'react-redux';
import { walletActions } from '../redux/actions';

const PaymentModal = (props) => {

    const sheetRef = useRef(null);
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const walletData = useSelector(state => state.wallet.walletDetails.currentWallet);

    const handlePress = (type) => {
        sheetRef.current.snapTo(1);
        props.setPaymentOption(type);
    }

    useEffect(() => {
        dispatch(walletActions.getWalletDetails(user));
    }, []);


    const paymentMethod = () => (
        <View
            style={{
                backgroundColor: 'black',
                height: 300,
                padding: 20,
                paddingTop: 10
            }}
        >
            <View style={styles.bar}></View>
            <Text style={styles.title}>Pick a payment method</Text>
            <ScrollView style={{ marginTop: 10 }} showsVerticalScrollIndicator={false}>

                {/* card payment option */}
                <Pressable style={styles.optionContainer} onPress={() => handlePress("card")}>
                    <View>
                        <View style={styles.radioButtonOuter}>
                            {props.paymentOption === "card" && <View style={styles.radioButtonInner}></View>}
                        </View>
                    </View>
                    <View style={styles.iconContainer}>
                        <Ionicons name="ios-card" size={26} color="#617CBF" />
                    </View>
                    <Text style={[styles.title, { fontSize: 18 }]}>Cards / Banking</Text>
                </Pressable>

                {/* wallet payment option */}
                <Pressable style={[styles.optionContainer, { justifyContent: "space-between" }]} onPress={() => handlePress("wallet")}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View>
                            <View style={styles.radioButtonOuter}>
                                {props.paymentOption === "wallet" && <View style={styles.radioButtonInner}></View>}
                            </View>
                        </View>
                        <View style={styles.iconContainer}>
                            <Entypo name="wallet" size={26} color="#617CBF" />
                        </View>
                        <Text style={[styles.title, { fontSize: 18 }]}>Wallet</Text>
                    </View>
                    <View style={{ height: 40 }}>
                        <PriceTag price={walletData && (walletData.length > 0 ? walletData[0].balance : 0)} icon={<Entypo name="wallet" size={24} color="black" />} />
                    </View>
                </Pressable>

                {/* borrow payment option */}
                <Pressable style={styles.optionContainer} onPress={() => handlePress("borrow")}>
                    <View>
                        <View style={styles.radioButtonOuter}>
                            {props.paymentOption === "borrow" && <View style={styles.radioButtonInner}></View>}
                        </View>
                    </View>
                    <View style={styles.iconContainer}>
                        <Image source={require('../../assets/images/borrow.png')} style={{ width: 26, height: 26 }} />
                    </View>
                    <Text style={[styles.title, { fontSize: 18 }]}>Borrow</Text>
                </Pressable>
            </ScrollView>

        </View>
    );


    return (
        <BottomSheet
            ref={sheetRef}
            snapPoints={['35%', '3%']}
            renderContent={paymentMethod}
            enabledContentTapInteraction={false}
            borderRadius={14}
        />
    )
}

export default PaymentModal

const styles = StyleSheet.create({
    bar: {
        backgroundColor: "white",
        width: 40,
        height: 6,
        borderRadius: 20,
        alignSelf: "center",
        marginBottom: 20
    },
    title: {
        color: "white",
        fontSize: 20,
        fontFamily: "MontserratSemiBold"
    },
    optionContainer: {
        backgroundColor: "#363636",
        paddingVertical: 10,
        borderRadius: 13,
        alignItems: "center",
        marginVertical: 6,
        flexDirection: "row",
        paddingHorizontal: 20
    },
    radioButtonOuter: {
        width: 26,
        height: 26,
        borderWidth: 2,
        borderColor: "#C4C4C4",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    radioButtonInner: {
        backgroundColor: "#617CBF",
        width: 18,
        height: 18,
        borderRadius: 30
    },
    iconContainer: {
        backgroundColor: "#F5F5F5",
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginHorizontal: 14
    }
})
