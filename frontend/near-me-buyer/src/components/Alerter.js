import React, { useEffect, useState } from 'react'
import { Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { alertActions } from '../redux/actions';

const Alerter = () => {

    const [visible, setVisible] = useState(false);
    const alertMessage = useSelector(state => state.alert.message);
    const alertType = useSelector(state => state.alert.type);
    const dispatch = useDispatch();

    //clear the alert
    useEffect(() => {
        setVisible(true);
        setTimeout(
            function () {
                // clear alert after 3 secomds
                dispatch(alertActions.clear());
            }, 3000);

    }, [alertMessage]);

    return (
        alertMessage ? (
            <Snackbar
                visible={visible}
                onDismiss={() => setVisible(false)}
                duration={3000}
                style={[{ marginBottom: 12, marginHorizontal: 20, borderRadius: 10 }, alertType === "success" ? { backgroundColor: "#20631A" } : { backgroundColor: "#CC3535" }]}
            >
                {alertMessage}
            </Snackbar>
        ) : (
            null
        )
    )
}

export default Alerter

