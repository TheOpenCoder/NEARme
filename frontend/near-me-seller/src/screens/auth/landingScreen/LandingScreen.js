import React from 'react'
import { Text, View, Image, SafeAreaView } from 'react-native'
import Button from '../../../components/Button';
import Alerter from '../../../components/Alerter';

const LandingScreen = ({ navigation }) => {

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#E5E5E5", alignItems: "center", justifyContent: "space-around" }}>
            <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
                <Image source={require('../../../../assets/images/nearLogo.png')} style={{ width: 200, resizeMode: "contain", height: 100 }} />
                <Text style={{ fontSize: 22, color: "#8C8C8C", textAlign: "center", marginTop: 18, fontFamily: "IBMMedium", paddingHorizontal: 10 }}>
                    <Text>Delivery Seller Hub</Text>
                </Text>
            </View>

            <View style={{ width: '100%', alignItems: "center", flex: 1, justifyContent: "flex-end", paddingBottom: 30 }}>
                <Button text="Login" type="outline" width="94%" style={{ marginVertical: 20 }} onPress={() => navigation.replace("LoginScreen")} />
                <Button text="Register" width="94%" onPress={() => navigation.replace("RegisterScreen")} />
            </View>
            <Alerter />
        </SafeAreaView>
    )
}

export default LandingScreen


