import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, View, FlatList, RefreshControl, Image } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSelector } from 'react-redux';

//components
import HeaderTitle from '../../../components/title/HeaderTitle';
import { PreviousOrdersData } from '../../../menus/temp/PreviousOrdersData';
import PreviousOrdersCard from '../../../components/cards/PreviousOrdersCard';

const ProfileScreen = () => {

    const [refreshing, setRefreshing] = useState(false);
    const user = useSelector(state => state.auth.user);


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        Haptics.selectionAsync()

        setTimeout(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            setRefreshing(false);
        }, 2000)

    }, []);


    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                    <Image source={{ uri: user.image }} style={styles.imageStyle} />
                <View style={styles.profileTextContainer}>
                    <Text style={[styles.profileDetails, { marginBottom: 2 }]}>{user.name}</Text>
                    <Text style={[styles.profileDetails, { color: "#7D7D7D" }]}>{user.email}</Text>
                </View>
            </View>
            <HeaderTitle name="Previous orders" style={styles.HeaderTitleContainer} />
            <FlatList
                showsVerticalScrollIndicator={false}
                data={PreviousOrdersData}
                keyExtractor={item => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['white']}
                        enabled
                        progressBackgroundColor="black"
                        tintColor="black"
                    />}
                renderItem={({ item }) => (
                    <PreviousOrdersCard
                        store={item.store}
                        time={item.time}
                        amount={item.amount}
                        image={item.image}
                    />
                )}
            />

        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E5E5E5"
    },
    profileContainer: {
        alignItems: "center",
        marginTop: 50,
        marginBottom: 40
    },
    profileDetails: {
        fontFamily: "MontserratSemiBold",
        fontSize: 22,
    },
    profileTextContainer: {
        marginTop: 10,
        alignItems: "center"
    },
    HeaderTitleContainer: {
        fontSize: 28,
        marginLeft: 20,
        marginBottom: 10
    },
    imageStyle: {
        width: 100,
        height: 100,
        borderRadius: 28
    }
})
