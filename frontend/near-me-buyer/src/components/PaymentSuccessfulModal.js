import React from 'react'
import { StyleSheet, Text, View, Modal } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import Button from './basic/Button';

const PaymentSuccessfulModal = (props) => {

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.modalVisible}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Ionicons name="checkmark-done-circle" size={84} color="#617CBF" style={{ marginBottom: 20, alignSelf: "center" }} />
                    <Text style={[styles.modalText, { fontFamily: "IBMSemiBold" }]}>Payment Successful</Text>
                    <Button
                        text="Yah!!"
                        style={{ marginVertical: 20 }}
                        onPress={() => props.handleClick()}
                     />
                </View>
            </View>
        </Modal>
    )
}

export default PaymentSuccessfulModal

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
