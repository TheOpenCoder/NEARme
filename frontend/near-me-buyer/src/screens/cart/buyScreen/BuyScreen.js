import React, {useState} from 'react'
import { Image, View, StyleSheet, Text } from 'react-native';
import OptionCard from '../../../components/cards/OptionCard';
import OrderInfoCard from '../../../components/cards/OrderInfoCard';
import Button from '../../../components/basic/Button';
import { useSelector, useDispatch } from 'react-redux';
import { rapydServices } from '../../../services';
import LoadingScreen from '../../../components/LoadingScreen';
import { alertActions } from '../../../redux/actions/alertActions';
import Alerter from '../../../components/Alerter';
import PaymentSuccessfulModal from '../../../components/PaymentSuccessfulModal';

const BuyScreen = ({ route, navigation }) => {

    const { paymentType, paymentDetail, PaymentImage, subtotal, deliveryCharge } = route.params;
    const user = useSelector(state => state.auth.user);
    const cartItems = useSelector(state => state.cart.cartItems);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();


    const createCheckoutData = async (type) => {

        const countryDetails = await rapydServices.getCurrency(user.country_code);
        let carts = cartItems.map(item => {
            return { "name": item.product_name, "amount": item.price, "quantity": item.quantity}
        });
        const checkData = {
            "country": user.country_code,
            "currency": countryDetails.currency_code,
            "customer": user.customer_id,
            "ewallet": user.wallet_id,
            "payment_fees": 1,
            "payment_method_type_categories": [type],
            "language": "en",
            "cart_items": carts
        }
        return checkData
    }

    const walletTransferData = async () => {

        const countryDetails = await rapydServices.getCurrency(user.country_code);
        const walletData = {
            "amount": subtotal + deliveryCharge,
            "currency": countryDetails.currency_code,
            "source_ewallet": user.wallet_id,
           "destination_ewallet": "ewallet_b60c6a83764c1a48fabf60e9aabd6286"
        }
        return walletData
    }

    const handleWalletClick = () => {
        navigation.navigate("PaymentScreen")
    }

    const orderRequestData = () => {

        let carts = cartItems.map(item => {
            return { "product_id": item.product_id, "quantity": item.quantity}
        });

        const orderReqData = {
            "seller_id": cartItems[0].seller_id,
            "order_price": subtotal + deliveryCharge,
            "products": carts
        }

        return orderReqData
    }

    const handlePurchase = async () => {
        setLoading(true);
        switch (paymentType) {
            case "Wallet":
                const walletData = await walletTransferData();
                rapydServices.walletTransfer(walletData)
                .then(
                    res => {
                        setModalVisible(true);
                    }
                )
                setLoading(false);
                break;
            case "Borrow":
                console.log("Borrow")
                break;
            case "Card / Banking":
                const checkoutCardData = await createCheckoutData("card");
                rapydServices.createCheckOutPage(checkoutCardData)
                .then(
                    res => {
                        setLoading(false);
                        const orderReqData = orderRequestData();
                        navigation.replace("RapydPaymentScreen", {checkout_id: res.id, type: "normal", orderReqData});
                    },
                    err => {
                        dispatch(alertActions.error(err.toString()));
                        setLoading(false);
                    }
                )
                break;
            case "Bank Transfer":
                const checkoutBankData = await createCheckoutData("bank_transfer");
                console.log(checkoutBankData);
                rapydServices.createCheckOutPage(checkoutBankData)
                .then(
                    res => {
                        setLoading(false);
                        const orderReqData = orderRequestData();
                        navigation.replace("RapydPaymentScreen", {checkout_id: res.id, type: "normal", orderReqData});
                    },
                    err => {
                        dispatch(alertActions.error(err.toString()));
                        setLoading(false);
                    }
                )
                break;
            case "Bank Redirect":
                const checkoutRedirectData = await createCheckoutData("bank_redirect");
                rapydServices.createCheckOutPage(checkoutRedirectData)
                .then(
                    res => {
                        setLoading(false);
                        const orderReqData = orderRequestData();
                        navigation.replace("RapydPaymentScreen", {checkout_id: res.id, type: "normal", orderReqData});
                    },
                    err => {
                        dispatch(alertActions.error(err.toString()));
                        setLoading(false);
                    }
                )
                break;
            default:
                setLoading(false);
        }
       
    }

    if(loading){
        return <LoadingScreen />
    }

    return (
        <View style={{ backgroundColor: "#E5E5E5", flex: 1 }}>
            <View style={{ flex: 7 }}>
                <View style={{ paddingVertical: 20 }}>
                    <OrderInfoCard
                        subtotal={subtotal}
                        deliveryCharge={deliveryCharge}
                    />
                </View>

                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image source={require('../../../../assets/images/location.png')} style={{ width: 30, height: 30 }} />
                    </View>
                    <View style={{ flex: 10 }}>
                        <Text numberOfLines={1} style={styles.text}>{user.address}</Text>
                        <Text numberOfLines={1} style={[styles.text, { color: "#6E6E6E" }]}>{user.location_name}</Text>
                    </View>
                </View>
                <OptionCard
                    title={paymentType}
                    subtitle={paymentDetail}
                    image={PaymentImage}
                    onPress={() => navigation.navigate("PaymentScreen", { totalPrice: subtotal + deliveryCharge })}
                />
            </View>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Button
                    text={`PURCHASE (₹${subtotal + deliveryCharge})`}
                    width={'94%'}
                    onPress={() => handlePurchase()}

                />
            </View>
            <PaymentSuccessfulModal modalVisible={modalVisible} handleClick={handleWalletClick} />
            <Alerter />
        </View>
    )
}

export default BuyScreen


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
