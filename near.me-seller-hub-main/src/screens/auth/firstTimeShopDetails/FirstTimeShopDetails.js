import React from 'react'
import ShopInfoScreen from '../../common/shopInfo/ShopInfoScreen';
import { SafeAreaView, Text } from 'react-native';
import HeaderTitle from '../../../components/title/HeaderTitle';

const FirstTimeShopDetails = ({route, navigation}) => {

    const { email, password } = route.params;

    
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#E5E5E5"}}>
       <HeaderTitle name="Shop Details" style={{margin: 20}} />
        <ShopInfoScreen 
            email={email}
            password={password}
        />
        </SafeAreaView>

    )
}

export default FirstTimeShopDetails

