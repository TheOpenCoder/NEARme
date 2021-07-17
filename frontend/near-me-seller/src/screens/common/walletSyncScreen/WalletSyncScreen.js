import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import Button from '../../../components/Button';

const WalletSyncScreen = () => {
    return (
        <View style={{flex: 1, backgroundColor: "#E5E5E5", padding: 20}}>
            <Text style={styles.mainText}>Looks like you already have an account in other NEARme services</Text>
            <Ionicons name="sync-circle" size={84} color="#617CBF" style={{ marginVertical: 20, alignSelf: "center" }} />
            <Text style={styles.subText}>Would you like to sync your wallet across all platforms?</Text>
            <Button text="Sync Wallet across platforms" style={{ marginVertical: 20 }} />
            <Text style={{fontFamily: "IBMSemiBold", color: "#464A29", marginVertical: 10, fontSize: 12}}>Note: Creating Seperate Wallet will require you to verify kyc again for legal requirements</Text>
            <Button text="Create Seperate Wallet" type="outline" />
        </View>
    )
}

export default WalletSyncScreen

const styles = StyleSheet.create({
    mainText: {
        fontFamily: "MontserratSemiBold",
        fontSize: 20
    },
    subText: {
        fontFamily: "IBMSemiBold",
        fontSize: 18,
        textAlign: "center"
    },
    note: {
        fontFamily: "IBMSemiBold",
    }
})
