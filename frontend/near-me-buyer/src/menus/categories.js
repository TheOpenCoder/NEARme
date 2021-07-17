import React from 'react';
import { Image } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export const categoriesMenu = [
    {
        "id": 1,
        "name": "Groceries",
        "icon": <Image source={require('../../assets/images/grocery.png')} fadeDuration={0} style={{ width: 40, height: 40 }} />
    }, {
        "id": 2,
        "name": "Food",
        "icon": <Ionicons name="fast-food" size={40} color="black" />
    }, {
        "id": 3,
        "name": "Medicine",
        "icon": <Image source={require('../../assets/images/pills.png')} fadeDuration={0} style={{ width: 40, height: 40 }} />
    }, {
        "id": 4,
        "name": "Fashion",
        "icon": <Image source={require('../../assets/images/fashion.png')} fadeDuration={0} style={{ width: 40, height: 40 }} />
    }, {
        "id": 5,
        "name": "Stationery",
        "icon": <FontAwesome5 name="pencil-ruler" size={30} color="black" />
    }, {
        "id": 6,
        "name": "Sports",
        "icon": <MaterialIcons name="sports-basketball" size={40} color="black" />
    }, {
        "id": 7,
        "name": "Electronics",
        "icon": <Image source={require('../../assets/images/plug.png')} fadeDuration={0} style={{ width: 40, height: 40 }} />
    }
]

