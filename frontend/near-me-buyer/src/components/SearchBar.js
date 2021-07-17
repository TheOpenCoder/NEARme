import React from 'react'
import { TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SearchBar = (props) => {

    return (
        <View style={{ marginHorizontal: 20, height: 50, marginTop: 20, borderRadius: 10, alignItems: "center", flexDirection: "row", paddingHorizontal: 10, backgroundColor: "#F3F3F5" }}>
            <Feather name="search" size={24} color="black" />
            <TextInput
                style={{ flex: 1, height: '100%', marginLeft: 10, fontSize: 20 }}
                onChangeText={props.setSearchText}
                value={props.searchText}
                placeholder="Try fruits or electronics"
                keyboardAppearance="dark"
            />
        </View>
    )
}

export default SearchBar

