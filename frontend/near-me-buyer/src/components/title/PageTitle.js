import React from 'react'
import { Text, StyleSheet } from 'react-native'

const PageTitle = (props) => {


    return (
        <Text numberOfLines={1} style={[styles.text, props.style && props.style]}>{props.name}</Text>
    )
}

export default PageTitle

const styles = StyleSheet.create({
    text: {
        fontFamily: 'MontserratMedium',
        fontSize: 20,
        marginTop: 4
    }
})