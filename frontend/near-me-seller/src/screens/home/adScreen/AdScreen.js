
import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderTitle from '../../../components/title/HeaderTitle';
import * as ImagePicker from 'expo-image-picker';
import { deniedPermissionHelper } from '../../../helpers/deniedPermissionsHelper';
import Button from '../../../components/Button';
import { Entypo } from '@expo/vector-icons';
import { adServices } from '../../../services';
import { HelperText } from 'react-native-paper';
import { alertActions } from '../../../redux/actions';
import { useDispatch } from 'react-redux';
import LoadingScreen from '../../../components/LoadingScreen';

const AdScreen = ({ route }) => {

    const { product, paymentType, paymentDetail, PaymentImage } = route.params;
    const navigation = useNavigation();
    const [image, setImage] = useState();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [deniedMediaAccess, setDeniedMediaAccess] = useState(false);
    const dispatch = useDispatch();
    
    const handleImageClick = () => {
        if (deniedMediaAccess) {
            deniedPermissionHelper()
        } else {
            if (Platform.OS !== 'web') {
                ImagePicker.requestMediaLibraryPermissionsAsync()
                    .then(({ status }) => {
                        if (status === "denied") {
                            setDeniedMediaAccess(true);
                        } else {
                            pickImage()
                        }
                    })
            }
        }
    }


    //handle pickImage
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };


    const handleAdPayment = () => {
        setSubmitted(true);
        if(image){
            setLoading(true);
            var data = new FormData();
            data.append('product_id', product.productId);
            data.append('seller_id', product.sellerId);
            let filename = image.split('/').pop();
            data.append('image', {uri: image, name: filename, type: 'image'});
            adServices.createAd(data)
            .then(() => {
                setLoading(false);
                dispatch(alertActions.success("Product is promoted"));
                navigation.navigate("HomeScreen")
            });
        }
    }

    if(loading){
        return <LoadingScreen />
    }


    return (
        <View style={styles.container}>
            <View style={{ flex: 7 }}>
                <ScrollView>
                    <Pressable onPress={() => handleImageClick()}>
                        {image ? (
                            <Image source={{ uri: image }} resizeMode="cover" style={styles.adImage} />
                        ) : (
                            <View style={[styles.adImage, { backgroundColor: "#5A5A5A", alignItems: "center", justifyContent: "center" }]}>
                                <Text style={{ color: "white" }}>{deniedMediaAccess ? "Need media access to set profile picture" : "pick image for store"}</Text>
                                {submitted && !image && (
                                    <HelperText type="error">
                                        Image is required
                                    </HelperText>
                                )}
                            </View>
                        )}

                    </Pressable>
                    <HeaderTitle name="Payment Details" style={{ fontSize: 24, marginTop: 40, marginLeft: 10 }} />
                    <TouchableOpacity style={styles.optionsContainer} onPress={() => console.log("hi")}>
                        <View style={styles.imageContainer}>
                        <Image source={PaymentImage} style={{ width: 30, height: 30 }} />
                        </View>
                        <View style={{ flex: 10 }}>
                            <Text numberOfLines={1} style={styles.text}>{paymentType}</Text>
                            <Text numberOfLines={1} style={[styles.text, { color: "#6E6E6E" }]}>{paymentDetail}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Entypo name="chevron-right" size={24} color="black" />
                        </View>
                    </TouchableOpacity>
                    <HeaderTitle name="Promoting Product" style={{ fontSize: 24, marginTop: 40, marginLeft: 10 }} />
                    <View style={{ flexDirection: "row", height: 120, margin: 20 }}>
                        <View style={{ flex: 1.2, marginRight: 10, position: "relative" }}>
                            <Image source={{ uri: product.image }} style={styles.image} />
                        </View>
                        <View style={{ flex: 2 }}>
                            <View style={{ flex: 2, paddingTop: 4 }}>
                                <Text numberOfLines={2} style={{ fontFamily: "MontserratMedium", fontSize: 16 }}>{product.name}</Text>
                                <Text numberOfLines={1} style={{ color: "#464A29" }}>Sports</Text>
                            </View>
                            <View style={{ flex: 1.5, flexDirection: "row" }}>
                                <View style={{ flex: 4, justifyContent: "center" }}>
                                    <Text style={{ fontFamily: "MontserratSemiBold", fontSize: 20 }}>₹{product.price}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <HeaderTitle name="Order Info" style={{ fontSize: 24, marginTop: 10, marginLeft: 10 }} />
                    <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 20, backgroundColor: "#F3F3F5", padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontFamily: "MontserratSemiBold", color: "#B0B0B0" }}>Ad Charges</Text>
                        <Text style={{ fontFamily: "MontserratSemiBold" }}>₹50</Text>
                    </View>
                </ScrollView>
            </View>
            <View style={{ flex: 1 }}>
                <Button text="Pay" style={{ marginVertical: 20, marginHorizontal: 10 }} onPress={() => handleAdPayment()} />
            </View>
        </View>
    )
}

export default AdScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E5E5E5",
        paddingTop: 14
    },
    adImage: {
        height: 200,
        width: '94%',
        alignSelf: "center",
        borderRadius: 10
    },
    image: {
        flex: 1,
        width: null,
        height: null,
        borderRadius: 10,
        resizeMode: "cover"
    },
    optionsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        marginHorizontal: 10,
    },
    text: {
        fontWeight: "700"
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
