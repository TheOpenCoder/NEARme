import React from 'react'
import { ScrollView, View } from 'react-native';

//components
import KycCommonScreen from '../../common/kycScreen/KycCommonScreen';

const KycScreen = () => {

    return (
        <View style={{backgroundColor: "#E5E5E5", flex: 1 }}>
            <ScrollView style={{ flex: 1, paddingTop: 50, backgroundColor: "#E5E5E5" }} showsVerticalScrollIndicator={false}>
                <KycCommonScreen  />
            </ScrollView>
        </View>
    )
}

export default KycScreen
