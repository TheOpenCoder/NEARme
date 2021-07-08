import React from 'react'
import ShopInfoScreen from '../../common/shopInfo/ShopInfoScreen';

const EditPage = ({navigation}) => {
    
    return (
        <ShopInfoScreen 
            submitHandler={() => navigation.navigate("HomeScreen")}
        />
    )
}

export default EditPage

