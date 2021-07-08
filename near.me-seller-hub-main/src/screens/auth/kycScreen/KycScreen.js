import React, { useState } from 'react'
import { StyleSheet, Text, View, Platform, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

//components
import HeaderTitle from '../../../components/title/HeaderTitle';
import Button from '../../../components/Button';
import { walletService } from '../../../services/walletService';
import ImagePickerCard from '../../../components/card/ImagePickerCard';

const KycScreen = () => {

    const [kycNeeded, setKycNeeded] = useState([
        {
            "country": "IN",
            "type": "DL",
            "name": "Driver's License",
            "is_back_required": true,
            "is_address_extractable": false
        },
        {
            "country": "IN",
            "type": "ID",
            "name": "Identity Card",
            "is_back_required": true,
            "is_address_extractable": false
        },
        {
            "country": "IN",
            "type": "PA",
            "name": "Passport",
            "is_back_required": false,
            "is_address_extractable": false
        },
        {
            "country": "IN",
            "type": "VI",
            "name": "Domestic Visa in Foreign Passport",
            "is_back_required": false,
            "is_address_extractable": false
        }
    ]);
    const [kycIndex, setkycIndex] = useState("");
    const [userImage, setUserImage] = useState(null);
    const [kycFrontImage, setKycFrontImage] = useState(null);
    const [kycBackImage, setKycBackImage] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const handleAddKyc = () => {
        setSubmitted(true);
    }

    console.log(kycIndex);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <ScrollView style={{ backgroundColor: "#E5E5E5" }} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <View style={{ marginHorizontal: 20 }}>
                        <Text style={[styles.subText, { color: "black" }]}>Promise is one of the features of near.me which lets you borrow or lend money to someone</Text>
                        <HeaderTitle name="Update Kyc" style={{ fontSize: 24, marginTop: 20 }} />
                        <Text style={[styles.subText, { marginBottom: 20 }]}>You need to verify your kyc before accessing Promise feature</Text>
                        <View style={{ alignItems: "center" }}>
                            <ImagePickerCard
                                image={userImage}
                                setImage={setUserImage}
                                submitted={submitted}
                            />
                        </View>
                    </View>
                    <HeaderTitle name="Kyc Document" style={[styles.subTitle, { marginBottom: 0 }]} />
                    <RNPickerSelect
                        onValueChange={(value, index) => setkycIndex(index)}
                        placeholder={{
                            label: 'Select your kyc method',
                            value: null,
                            color: "black"
                        }}
                        style={Platform.OS === 'ios' ? { "inputIOS": styles.inputIOS } : { "inputAndroid": styles.inputAndroid }}
                        items={kycNeeded.map(value => {
                            return {label: value.name, value: value.name}
                        })}
                    />
                    {kycIndex ? (
                        <View>
                            <HeaderTitle name={`${kycNeeded[kycIndex - 1].name} Front Side`} style={styles.subTitle} />
                            <View style={{ marginHorizontal: 20 }}>
                                <ImagePickerCard
                                    image={kycFrontImage}
                                    setImage={setKycFrontImage}
                                    submitted={submitted}
                                    long
                                />
                            </View>
                            {kycNeeded[kycIndex - 1].is_back_required && (
                                <>
                                <HeaderTitle name={`${kycNeeded[kycIndex - 1].name} Back Side`} style={styles.subTitle} />
                            <View style={{ marginHorizontal: 20 }}>
                                <ImagePickerCard
                                    image={kycBackImage}
                                    setImage={setKycBackImage}
                                    submitted={submitted}
                                    long
                                />
                            </View>
                                </>
                            )}
                            <Button text="Update Kyc" style={{ margin: 20 }} onPress={() => handleAddKyc()} />
                        </View>
                    ) : (
                        <View></View>
                    )}
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}

export default KycScreen

const styles = StyleSheet.create({
    inputIOS: {
        marginHorizontal: 20,
        fontSize: 22,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: '#ADADAD',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        marginVertical: 20
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderColor: '#ADADAD',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
    },
    container: {
        flex: 1,
        backgroundColor: "#E5E5E5"
    },
    subText: {
        fontFamily: "IBMMedium",
        color: "#6F6F6F",
        marginTop: 4
    },
    imageClickableContainer: {
        backgroundColor: "#F5F5F5",
        width: 140,
        height: 140,
        alignItems: "center",
        justifyContent: "center",
        padding: 10
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 20
    },
    smallBold: {
        textAlign: "center",
        fontFamily: "MontserratSemiBold"
    },
    subTitle: {
        fontSize: 20,
        marginTop: 40,
        marginHorizontal: 20,
        marginBottom: 20
    }
})
