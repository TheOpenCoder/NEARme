import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

//components
import HeaderTitle from '../../../components/title/HeaderTitle';
import Button from '../../../components/Button';
import ImagePickerCard from '../../../components/card/ImagePickerCard';
import { rapydServices } from '../../../services';
import LoadingScreen from '../../../components/LoadingScreen';
import { authActions } from '../../../redux/actions';
import { useSelector, useDispatch } from 'react-redux';

const KycCommonScreen = () => {

    const [kycNeeded, setKycNeeded] = useState([]);
    const [loading, setLoading] = useState(false);
    const seller = useSelector(state => state.auth.seller);
    const dispatch = useDispatch();

    useEffect(() => {
        rapydServices.listOfficialDocuments(seller.country_code)
        .then(
            res => {
                setKycNeeded(res)
            }
        ),
        err => console.log(err);
        
    }, []);

    const [kycIndex, setkycIndex] = useState("");
    const [userImage, setUserImage] = useState(null);
    const [kycFrontImage, setKycFrontImage] = useState(null);
    const [kycBackImage, setKycBackImage] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const handleAddKyc = () => {
        setSubmitted(true);
        if(userImage && kycFrontImage && (kycNeeded[kycIndex - 1].is_back_required ? kycBackImage : true)){
            setLoading(true);
            const verificationObject = {
                "reference_id": "nearUser_" + seller.email,
                "ewallet": seller.wallet_id,
                "document_type": kycNeeded[kycIndex - 1].type,
                "country": seller.country_code,
                "face_image": userImage.base64,
                "face_image_mime_type": getMemeType(userImage),
                "front_side_image": kycFrontImage.base64,
                "front_side_image_mime_type": getMemeType(kycFrontImage)
            }
            if(kycNeeded[kycIndex - 1].is_back_required){
                verificationObject.back_side_image = kycBackImage.base64,
                verificationObject.back_side_image_mime_type = getMemeType(kycBackImage)
            }
            rapydServices.verifyIdentity(verificationObject)
            .then(
                res => {
                    console.log("came to res");
                    console.log(res);
                    dispatch(authActions.completeRegistration(seller.id, "true"));
                    setLoading(false);
                },
                err => {
                    console.log(err);
                    dispatch(authActions.completeRegistration(seller.id, "false"));
                    setLoading(false);
                }
            )
        }
    }

    const getMemeType = (image) => {
        var afterDot = image.uri.substr(image.uri.indexOf('.') + 1);
        if(afterDot === "jpg"){
            afterDot = "jpeg"
        } 
        return 'image/' + afterDot;
    }

    console.log(kycIndex);

    if(loading){
        return (
        <LoadingScreen />
        )
    }

    return (
                <View style={styles.container}>
                    <View style={{ marginHorizontal: 20 }}>
                        <HeaderTitle name="Update Kyc" style={{ fontSize: 24, marginTop: 20 }} />
                        <Text style={[styles.subText, { marginBottom: 20 }]}>You need to verify your kyc to access Promise and wallet feature</Text>
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
                            <Button text="Update Kyc" style={{ margin: 20, marginBottom: 150 }} onPress={() => handleAddKyc()} />
                        </View>
                    ) : (
                        <View></View>
                    )}
                </View>
    )
}

export default KycCommonScreen

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
