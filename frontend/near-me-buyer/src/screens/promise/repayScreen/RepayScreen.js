import React from 'react'
import { View, FlatList } from 'react-native';

import { promiseData } from '../../../menus';
import PromiseCard from '../../../components/cards/PromiseCard';

const RepayScreen = () => {

    const checkRepayData = (promiseData) => {
        return promiseData.type === "repay"
    }

    return (
        <View style={{ backgroundColor: "#E5E5E5", flex: 1, paddingTop: 8 }}>
            <FlatList
                data={promiseData.filter(checkRepayData)}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <PromiseCard
                        type={item.type}
                        profile={item.profile}
                        data={item.data}
                    />
                )}
            />
        </View>
    )
}

export default RepayScreen

