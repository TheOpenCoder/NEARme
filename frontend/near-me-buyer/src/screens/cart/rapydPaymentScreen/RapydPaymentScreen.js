import React, { useRef, useState } from 'react'
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import PaymentSuccessfulModal from '../../../components/PaymentSuccessfulModal';
import { cartActions } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { orderServices } from '../../../services';

const RapydPaymentScreen = ({ route }) => {

    const webviewRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const {checkout_id, type, orderReqData} = route.params;
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const handleClick = () => {
        if(type === "topup"){
            setModalVisible(false);
            navigation.goBack();
            } else {
            orderServices.makeOrder(user.id, orderReqData)
            .then(
                () => {
                    dispatch(cartActions.clearBag());
                    setModalVisible(false);
                    navigation.navigate("CartScreen");
                },
                err => console.log(err)
            )
        }
    }

    const html = `
<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapyd Checkout Toolkit</title>
    <script src="https://sandboxcheckouttoolkit.rapyd.net"></script>
    <script>
        window.onload = function () {
            let checkout = new RapydCheckoutToolkit({
                pay_button_text: "Pay",
                pay_button_color: "black",
                id: "${checkout_id}",
                close_on_complete: false
            });
            checkout.displayCheckout();
        }
        window.addEventListener('onCheckoutPaymentSuccess', function (event) {
            if(event.detail.status === "CLO"){
                window.ReactNativeWebView.postMessage("Paid Successfully");
            }
            if(event.detail.status === "ACT"){
                window.location = (event.detail.redirect_url); 
            }
            window.ReactNativeWebView.postMessage(event.detail);
        });
        window.addEventListener('onCheckoutFailure', function (event) {
            window.ReactNativeWebView.postMessage(event.detail.error);
        });
    </script>
</head>

<body style="background-color: #E5E5E5; display: flex; align-items: center; flex-direction: column; margin: 10px">
    <div style="width: ${Dimensions.get('window').width}px" id="rapyd-checkout"></div>
</body>

</html>`;

    const handleWebViewNavigationStateChange = (newNavState) => {

        const { url } = newNavState;
        if (!url) return;

        if (url.includes('https://sandboxcheckout.rapyd.net/thank-you-success/')) {
            setModalVisible(true);
        }
    };



    return (
        <View style={{ flex: 1, backgroundColor: "#E5E5E5"}}>
            <PaymentSuccessfulModal modalVisible={modalVisible} setModalVisible={setModalVisible} handleClick={handleClick} />
            <WebView
                ref={(ref) => (webviewRef.current = ref)}
                source={{ html }}
                style={{ flex: 1, backgroundColor: "#E5E5E5" }}
                showsVerticalScrollIndicator={false}
                onMessage={(event) => {
                    if (event.nativeEvent.data === "Paid Successfully") {
                        setModalVisible(true);
                    } else {
                        console.log(event.nativeEvent.data);
                    }
                }}
                showsHorizontalScrollIndicator={false}
                onNavigationStateChange={handleWebViewNavigationStateChange}
            />
        </View>
    )

}

export default RapydPaymentScreen

const styles = StyleSheet.create({})
