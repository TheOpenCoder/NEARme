import React from 'react'
import { StyleSheet, Text, View, FlatList, Image } from 'react-native'
import DeliveredProfile from '../../../components/card/DeliveredProfile';
import HeaderTitle from '../../../components/title/HeaderTitle';
import { PreviousOrdersData } from '../../../menu/temp/PreviousOrdersData';
import { useSelector } from 'react-redux';

const ProfileScreen = () => {

    const seller = useSelector(state => state.auth.seller);

    return (
        <View style={{ flex: 1, backgroundColor: "#E5E5E5" }}>
            <View style={{ alignItems: "center", height: 200, justifyContent: "center", marginVertical: 20 }}>
            <Image source={{ uri: seller.image }} style={styles.imageStyle} />
                <View style={{ marginTop: 10, alignItems: "center" }}>
                    <Text style={{ fontFamily: "MontserratSemiBold", fontSize: 22, marginBottom: 2 }}>{seller.name}</Text>
                    <Text style={{ fontFamily: "MontserratSemiBold", fontSize: 22, color: "#7D7D7D" }}>{seller.email}</Text>
                </View>
            </View>
            <HeaderTitle name="Previous orders" style={{ fontSize: 28, marginLeft: 20, marginBottom: 10 }} />
            <FlatList
                showsVerticalScrollIndicator={false}
                data={PreviousOrdersData}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <DeliveredProfile
                        name={item.name}
                        time={item.time}
                        earned={item.earned}
                        image={item.image}
                    />
                )}
            />

        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    imageStyle: {
        width: 100,
        height: 100,
        borderRadius: 28
    }
})
