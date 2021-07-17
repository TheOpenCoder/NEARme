import React from 'react'
import { StyleSheet, Text, View, Modal } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import Button from './basic/Button';

const WalletSyncModal = (props) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.modalVisible}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Ionicons name="sync-circle" size={84} color="#617CBF" style={{ marginBottom: 20, alignSelf: "center" }} />
                    <Text style={[styles.modalText, { fontFamily: "MontserratSemiBold", marginBottom: 80 }]}>Looks like you already have an account in other near.me services</Text>
                    <Text style={[styles.modalText, { fontFamily: "IBMSemiBold" }]}>Would you like to sync your wallet across all platforms?</Text>
                    <Button text="Sync Wallet across platforms" style={{ marginVertical: 20 }} onPress={() => setModalVisible(!modalVisible)} />
                    <Button text="Create Seperate Wallet" type="outline" />
                </View>
            </View>
        </Modal>
    )
}

export default WalletSyncModal

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.8);",
    },
    modalView: {
        margin: 10,
        backgroundColor: '#E5E5E5',
        borderRadius: 10,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18
    }
})
