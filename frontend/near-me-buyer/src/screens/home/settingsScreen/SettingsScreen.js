import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import SubHeading from '../../../components/title/SubHeading';
import { useSelector, useDispatch } from 'react-redux';
import { useDebounce } from '../../../hooks/debounceHook';
import { authActions } from '../../../redux/actions';
const SettingsScreen = () => {

    const lend_limit = useSelector(state => state.auth.user.lend_limit);
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    const [lendingAmountNotificationValue, setLendingAmountNotificationValue] = useState(lend_limit ? lend_limit : 100);


    useDebounce(lendingAmountNotificationValue, 1000, () => dispatch(authActions.updateLendLimit(user, {"lend_limit" : lendingAmountNotificationValue})));




    return (
        <View style={styles.container}>
            <SubHeading name="Notification" />
            <View style={styles.headingSpace}>
                <Text style={styles.mainHeading}>Lending Amount Notification:</Text>
                <Text style={styles.subHeading}>Users Borrow Request will be sent to you based on the amount you set here</Text>
            </View>
            <Text style={styles.amountText}>Around ₹{lendingAmountNotificationValue}</Text>
            <Slider
                style={styles.slider}
                minimumValue={100}
                maximumValue={10000}
                thumbTintColor="#464A29"
                step={100}
                minimumTrackTintColor="#464A29"
                value={lendingAmountNotificationValue}
                onValueChange={setLendingAmountNotificationValue}
                maximumTrackTintColor="#000000"
            />
              <SubHeading name="Borrow" />
            <View style={styles.headingSpace}>
                <Text style={styles.mainHeading}>Borrow Limit: ₹10000</Text>
                <Text style={styles.subHeading}>Your borrow limit will be automatically determined based on your lending and repay usage</Text>
            </View>
        </View>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#E5E5E5",
        flex: 1
    },
    headingSpace: {
        marginHorizontal: 20,
        marginBottom: 10
    },
    mainHeading: {
        fontSize: 18,
        fontFamily: "MontserratSemiBold"
    },
    subHeading: {
        fontFamily: "IBMMedium",
        color: "#6F6F6F",
        marginTop: 4
    },
    amountText: {
        fontSize: 18,
        fontFamily: "MontserratSemiBold",
        marginHorizontal: 20
    },
    slider: {
        width: '90%',
        height: 40,
        alignSelf: "center"
    }
})
