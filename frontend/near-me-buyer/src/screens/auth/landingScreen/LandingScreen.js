import React from 'react'
import { StyleSheet, Text, View, Image, SafeAreaView } from 'react-native'
import Button from '../../../components/basic/Button';
import Alerter from '../../../components/Alerter';

const LandingScreen = ({ navigation }) => {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headingContainer}>
                <Image source={require('../../../../assets/images/nearLogo.png')} style={styles.image} />
                <Text style={styles.subText}>
                    <Text>Find and buy from stores</Text>
                    <Text style={{ color: "black" }}> near </Text>
                    <Text>your</Text>
                    <Text style={{ color: "black" }}> neighbourhood.</Text>
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                <Button text="Login" type="outline" width="94%" style={{ marginVertical: 20 }} onPress={() => navigation.replace("LoginScreen")} />
                <Button text="Register" width="94%" onPress={() => navigation.replace("RegisterScreen")} />
            </View>
            <Alerter />
        </SafeAreaView>
    )
}

export default LandingScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E5E5E5",
        alignItems: "center",
        justifyContent: "space-around"
    },
    headingContainer: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center"
    },
    image: {
        width: 200,
        resizeMode: "contain",
        height: 100
    },
    subText: {
        fontSize: 18,
        color: "#8C8C8C",
        textAlign: "center",
        marginTop: 18,
        fontFamily: "IBMMedium",
        paddingHorizontal: 10
    },
    buttonContainer: {
        width: '100%',
        alignItems: "center",
        flex: 1,
        justifyContent: "flex-end",
        paddingBottom: 30
    }
})