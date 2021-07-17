import React from 'react'
import { Text, View, Image } from 'react-native'

const MapCallOutView = (props) => {
    return (
        <View style={{ backgroundColor: "#F5F5F5", borderRadius: 10, padding: 10, flexDirection: "row", width: 200, flex: 1 }}>
            <Image source={props.image} style={{ width: 60, height: 60, borderRadius: 10, marginRight: 10 }} />
            <View style={{ flex: 1 }}>
                <Text numberOfLines={2} style={{ fontSize: 18 }}>{props.title}</Text>
                <Text style={{ color: "#969696" }}>{props.subTitle && props.subTitle}</Text>
            </View>
        </View>
    )
}

export default MapCallOutView

