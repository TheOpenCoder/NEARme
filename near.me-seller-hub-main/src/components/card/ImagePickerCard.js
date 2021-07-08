import React, {useState} from 'react'
import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { HelperText } from 'react-native-paper';

import { deniedPermissionHelper } from '../../helpers';

const ImagePickerCard = (props) => {


    const [deniedMediaAccess, setDeniedMediaAccess] = useState(false);
    const [deniedCameraAccess, setDeniedCameraAccess] = useState(false);


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


    const handleCameraClick = () => {
        if (deniedCameraAccess) {
            deniedPermissionHelper()
        } else {
            if (Platform.OS !== 'web') {
                ImagePicker.requestCameraPermissionsAsync()
                    .then(({ status }) => {
                        if (status === "denied") {
                            setDeniedCameraAccess(true);
                        } else {
                            openCamera()
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
                aspect: [4, 3],
                quality: 1,
                base64: true
            });
    
            if (!result.cancelled) {
                props.setImage(result);
            }
        };
    
        //handle open camera
        const openCamera = async () => {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                base64: true
            });
    
            if (!result.cancelled) {
                props.setImage(result);
            }
        };
    


    return (
        <View style={styles.container}>
            <Pressable onPress={() => handleCameraClick()} style={[styles.imageClickableContainer, props.long && {width: '100%'}]}>
                {props.image ? (
                    <Image source={{ uri: props.image.uri }} resizeMode="cover" style={[styles.profileImage, props.long && {width: '100%'}]} />
                ) : (
                    <>
                        <Text style={{ textAlign: "center" }}>
                            {deniedMediaAccess ? "Need media access to set profile picture" : "Take Selfie"}
                        </Text>
                        {props.submitted && !props.image && (
                            <HelperText type="error">
                                Image is required
                            </HelperText>
                        )}
                    </>
                )}
            </Pressable>
            <Text style={[styles.smallBold, { marginVertical: 10 }]}>OR</Text>
            <Pressable onPress={() => handleImageClick()}>
                <Text style={styles.smallBold}>Pick from gallery</Text>
            </Pressable>
            </View>
    )
}

export default ImagePickerCard

const styles = StyleSheet.create({
    container: {
        backgroundColor: "blue", 
        padding: 16, 
        alignItems: "center", 
        borderRadius: 20,
        backgroundColor: "#F5F5F5"
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 20
    },
    smallBold: {
        textAlign: "center", 
        fontFamily: "MontserratSemiBold",
    },
    imageClickableContainer: {
        backgroundColor: "#F5F5F5",
        width: 140,
        height: 140,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,  
        elevation: 2
    },
})
