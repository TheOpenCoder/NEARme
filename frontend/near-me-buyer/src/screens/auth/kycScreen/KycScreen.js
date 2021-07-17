import React from 'react'
import { ScrollView, SafeAreaView, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

//components
import KycCommonScreen from '../../common/kycScreen/KycCommonScreen';
import Button from '../../../components/basic/Button';
import { authActions } from '../../../redux/actions';

const KycScreen = () => {

    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    const handleSkipPress = () => {
        dispatch(authActions.completeRegistration(user.id, "false"));
    }

    return (
        <View style={{ position: "relative", backgroundColor: "#E5E5E5", flex: 1 }}>
            <ScrollView style={{ flex: 1, paddingTop: 50 }} showsVerticalScrollIndicator={false}>
                <KycCommonScreen  />
            </ScrollView>
            <SafeAreaView style={{ position: "absolute", width: "100%", bottom: 0, alignItems: "flex-end", right: 10 }}>
                <Button text="Skip" width="40%" onPress={handleSkipPress} />
            </SafeAreaView>
        </View>
    )
}

export default KycScreen
