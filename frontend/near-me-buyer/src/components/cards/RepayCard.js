import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';

const RepayCard = (props) => {


    const customizedSubHeading = () => {
        switch (props.data.length) {
            case 1:
                return props.data[0].profile.name;
            case 2:
                return `${props.data[0].profile.name} & ${props.data[1].profile.name}`;
            default:
                return `${props.data[0].profile.name} & ${props.data.length - 1} others`;
        }
    }



    return (
        <TouchableOpacity style={styles.container} onPress={() => props.navigation.navigate("RepayScreen")}>
            <View style={{ flex: 0.4 }}></View>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 5 }}>
                {props.data.length > 1 ? (
                    <View style={{ height: 70, marginRight: 6 }}>
                        <Image source={props.data[0].profile.profilePic} style={styles.multipleImage} />
                        <Image source={props.data[1].profile.profilePic} style={[styles.multipleImage, { position: "absolute", bottom: 0, alignSelf: "flex-end", borderWidth: 2, borderColor: "#E5E5E5" }]} />
                    </View>
                ) : (
                    <Image source={require('../../../assets/images/temp/profile1.png')} style={styles.image} />
                )}

                <View>
                    <Text style={styles.text}>Repay pending</Text>
                    <Text style={[styles.text, { color: "#6E6E6E" }]}>{customizedSubHeading()}</Text>
                </View>
            </View>
            <Entypo name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
    )
}

export default RepayCard

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        marginHorizontal: 10,
        borderBottomColor: "#CDCDCD",
        borderBottomWidth: 1,
    },
    multipleImage: {
        width: 50,
        height: 50,
        borderRadius: 18,
        marginRight: 8,
        marginLeft: 2
    },
    button: {
        flex: 1,
        paddingVertical: 6,
        alignItems: "center",
        borderRadius: 6,
        borderWidth: 2
    },
    text: {
        fontWeight: "700"
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 20,
        marginRight: 6,
        marginLeft: 2,
    },
})
