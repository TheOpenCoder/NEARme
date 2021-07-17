import React from 'react'
import { Text, View } from 'react-native'

const CenteredText = (props) => {
    return (
        <View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#E5E5E5"}}>
            <Text style={{fontSize: 22, fontFamily: "IBMMedium"}}>{props.text}</Text>
        </View>
    )
}

export default CenteredText

