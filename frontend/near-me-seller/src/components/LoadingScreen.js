import React from 'react'
import { View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper';

const LoadingScreen = () => {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#E5E5E5" }}>
            <ActivityIndicator animating={true} color="black" />
        </View>
    )
}

export default LoadingScreen


