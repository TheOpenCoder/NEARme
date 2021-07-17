import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

import ByProduct from './ByProduct';
import ByShop from './ByShop';
import TabTitle from '../../../components/title/TabTitle';

const CategoryScreen = ({route}) => {

    const {name} = route.params;

    return (
        <Tab.Navigator
            sceneContainerStyle={{ backgroundColor: "#E5E5E5" }}
            tabBarOptions={{
                inactiveTintColor: "#ADADAD",
                tabStyle: { backgroundColor: "#E5E5E5", alignItems: "flex-start", },
                labelStyle: { fontSize: 24, fontFamily: "MontserratSemiBold", marginTop: 20, },
                pressOpacity: 1,
                style: {
                    elevation: 0,
                    shadowOffset: {
                        width: 0, height: 0
                    }
                }
            }}
        >
            <Tab.Screen
                name="ByProduct"
                component={ByProduct}
                options={({navigation, route}) => ({
                    title: () => <TabTitle name="Products" quantity={route.params.length} isFocused={navigation.isFocused()} />,

                })}
                initialParams={{name: name}}
            />
            <Tab.Screen
                name="ByShop"
                component={ByShop}
                options={({navigation, route}) => ({
                    title: () => <TabTitle name="Shops" quantity={route.params.length} isFocused={navigation.isFocused()} />,
                })}
                initialParams={{name: name}}
            />
        </Tab.Navigator>
    )
}

export default CategoryScreen


