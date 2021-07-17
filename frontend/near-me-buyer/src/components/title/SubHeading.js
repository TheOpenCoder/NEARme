import React from 'react'
import { Text } from 'react-native'

const SubHeading = (props) => {
    return (
        <Text style={{ fontFamily: "MontserratSemiBold", fontSize: 26, marginTop: 20, marginLeft: 20, marginBottom: 14 }}>{props.name}</Text>
    )
}

export default SubHeading

