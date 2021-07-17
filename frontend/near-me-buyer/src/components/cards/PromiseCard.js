import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'

const PromiseCard = (props) => {
    return (
        <View style={styles.container}>
            <Text style={{ flex: 0.4, fontWeight: "700" }}>{props.data.duration}</Text>
            <Image source={props.profile.profilePic} style={styles.image} />
            {props.type === "borrow" ? (
                <>
                    <Text style={{ flex: 2 }}>
                        <Text style={styles.textBold}>{props.profile.name + " "}</Text>
                        <Text style={styles.textLight}>wants to borrow</Text>
                        <Text style={styles.textBold}>{" "}₹{props.data.amount + " "}</Text>
                        <Text style={styles.textLight}>from you.</Text>
                    </Text>
                    <TouchableOpacity style={[styles.button, { backgroundColor: "black", borderColor: "black", marginHorizontal: 4 }]}>
                        <Text style={{ color: "white" }}>Lend</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { borderColor: "#ADADAD" }]}>
                        <Text>Deny</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text style={{ flex: 2.5 }}>
                        <Text style={styles.textBold}>{props.profile.name + " "}</Text>
                        <Text style={styles.textLight}>lent you</Text>
                        <Text style={styles.textBold}>{" "}₹{props.data.amount}.{" "}</Text>
                        <Text style={styles.textLight}>For now</Text>
                        <Text style={styles.textBold}>{" "}₹{props.data.repayAmount + " "}</Text>
                        <Text style={styles.textLight}>needs to be repaid</Text>
                    </Text>
                    <TouchableOpacity style={[styles.button, { backgroundColor: "black", borderColor: "black", marginHorizontal: 4, flex: 1.5 }]}>
                        <Text style={{ color: "white" }}>Repay</Text>
                    </TouchableOpacity>
                </>
            )}

        </View >
    )
}

export default PromiseCard

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 10
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 20,
        marginRight: 6,
        marginLeft: 2,
    },
    button: {
        flex: 1,
        paddingVertical: 6,
        alignItems: "center",
        borderRadius: 6,
        borderWidth: 2
    },
    textBold: {
        fontWeight: "700"
    },
    textLight: {
        fontWeight: "400"
    }
})
