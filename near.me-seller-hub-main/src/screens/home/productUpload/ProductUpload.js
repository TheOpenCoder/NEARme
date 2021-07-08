import React, { useState, useEffect } from 'react'
import { Image, View, Text, Platform, Pressable, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Button from '../../../components/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { formatter, validator } from '../../../helpers'
import { TextInput as PaperTextInput, HelperText } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { useSelector } from 'react-redux';
import { productServices } from '../../../services';

const ProductUpload = ({navigation}) => {

    const [deniedMediaAccess, setDeniedMediaAccess] = useState(false);
    const [image, setImage] = useState(null);
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const sellerId = useSelector(state => state.auth.seller.id);


    //get permission for accessing media
    useEffect(() => {
        if (Platform.OS !== 'web') {
            ImagePicker.requestMediaLibraryPermissionsAsync()
                .then(({ status }) => {
                    if (status === "denied") {
                        setDeniedMediaAccess(true);
                    }
                })
        }
    }, []);

    //handle pickImage
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result);
        }
    };


    const handleAddProduct = () => {
        setSubmitted(true);
        if (checkAllValues()) {
            var data = new FormData();
            data.append('name', productName);
            data.append('category', category);
            data.append('price', price);
            data.append('seller_id', sellerId);
            let localUri = image.uri;
            let filename = localUri.split('/').pop();
            data.append('image', {uri: localUri, name: filename, type: 'image'});
            productServices.addProduct(data)
            .then(() => navigation.navigate("HomeScreen"))
        }
    }

    const checkAllValues = () => {
        if (validator.validateNotNull(true, productName) && validator.validateNotNull(true, category) && validator.validateNotNull(true, price) && image) {
            return true;
        }
        return false;
    }



    if (deniedMediaAccess) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#E5E5E5" }}>
                <Text style={{ fontSize: 24, textAlign: "center", marginVertical: 20 }}>Media access is needed to proceed further</Text>
                <Button text="Provide Access" onPress={() => handleMediaRerequest()} />
            </View>
        )
    }


    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: "#E5E5E5", paddingTop: 20 }}
            showsVerticalScrollIndicator={false}
        >
            <View style={{ flexDirection: "row", height: 140, marginHorizontal: 10, marginBottom: 20, backgroundColor: "#F5F5F5", padding: 10, borderRadius: 10 }}>
                <View style={{ flex: 1.2, marginRight: 10, position: "relative" }}>
                    {image ? <Image source={{ uri: image.uri }} style={styles.image} /> : <Image source={require('../../../../assets/images/image-placeholder.png')} style={styles.image} />}
                </View>
                <View style={{ flex: 2 }}>
                    <Pressable style={{ flex: 2, paddingTop: 4 }}>
                        <Text numberOfLines={2} style={{ fontFamily: "MontserratMedium", fontSize: 16 }}>{productName ? productName : ".................."}</Text>
                        <Text numberOfLines={1} style={{ color: "#464A29" }}>{category ? category : "................"}</Text>
                    </Pressable>
                    <View style={{ flex: 1.5, flexDirection: "row" }}>
                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <Text style={{ fontFamily: "MontserratSemiBold", fontSize: 20 }}>₹{price ? price : "............."}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ paddingHorizontal: 20, marginBottom: 70 }}>
                <View>
                    <PaperTextInput
                        label="Product Name"
                        value={productName}
                        onChangeText={setProductName}
                        selectionColor="#464A29"
                        underlineColor="#BBBBBB"
                        keyboardAppearance="dark"
                        error={!validator.validateNotNull(submitted, productName)}
                    />
                    <HelperText type="error" visible={!validator.validateNotNull(submitted, productName)}>
                        Product name is required
                    </HelperText>
                </View>

                <RNPickerSelect
                    onValueChange={setCategory}
                    placeholder={{
                        label: 'Select your shop category',
                        value: null,
                        color: "black"
                    }}
                    style={Platform.OS === 'ios' ? { "inputIOS": styles.inputIOS } : { "inputAndroid": styles.inputAndroid }}
                    items={[
                        { label: 'Groceries', value: 'Groceries' },
                        { label: 'Food', value: 'Food' },
                        { label: 'Medicine', value: 'Medicine' },
                        { label: 'Electronics', value: 'Electronics' },
                        { label: 'Sports', value: 'Sports' },
                    ]}
                />
                <HelperText type="error" visible={!validator.validateNotNull(submitted, category)}>
                    category is required
                </HelperText>

                <View>
                    <PaperTextInput
                        label="Price"
                        value={price}
                        onChangeText={(value) => (setPrice(formatter.formatOnlyNumber(value)))}
                        selectionColor="#464A29"
                        maxLength={5}
                        underlineColor="#BBBBBB"
                        keyboardType="number-pad"
                        keyboardAppearance="dark"
                        error={!validator.validateNotNull(submitted, price)}
                    />
                    <HelperText type="error" visible={!validator.validateNotNull(submitted, price)}>
                        price is required
                    </HelperText>
                </View>

                <Pressable style={{ backgroundColor: "#5A5A5A", height: 120, borderRadius: 10, alignItems: "center", justifyContent: "center" }} onPress={pickImage}>
                    <Text style={{ color: "white" }}>Click here to pick image</Text>
                </Pressable>
                <HelperText type="error" visible={submitted && !image}>
                    Image is required
                </HelperText>
                <Button text="Add Product" onPress={() => handleAddProduct()} />
            </View>
        </KeyboardAwareScrollView>
    )
}

export default ProductUpload

const styles = StyleSheet.create({
    image: {
        flex: 1,
        width: null,
        height: null,
        borderRadius: 10,
        resizeMode: "cover"
    },
    inputIOS: {
        fontSize: 20,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: '#ADADAD',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        marginVertical: 10
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
});