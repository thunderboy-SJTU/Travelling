/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {createStackNavigator,createAppContainer} from 'react-navigation';
import {MapScreen} from './components/MapScreen';
import {SearchScreen} from './components/SearchScreen';
import {RouteScreen} from './components/RouteScreen'

//create stack navigator
const AppNavigator = createStackNavigator(
    {
        Home: { screen: MapScreen },
        Search: {screen: SearchScreen},
        Route: {screen: RouteScreen}
    },
    {
        defaultNavigationOptions: {
            headerTintColor: '#000',
            headerStyle: {
                backgroundColor: '#fff',
            },
        }
    }

);

export default createAppContainer(AppNavigator);


