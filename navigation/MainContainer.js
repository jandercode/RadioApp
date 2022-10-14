import { StatusBar } from 'expo-status-bar';
import { Audio } from "expo-av";
import { View,
  Text,
  StyleSheet,
  Button,
  Image,
  FlatList} from 'react-native';
import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'

import HomeScreen from './screens/HomeScreen';
import FavouritesScreen from './screens/FavouritesScreen';

const homeName = "Home";
const favouritesName = "Favourites"

const Tab = createBottomTabNavigator();

export default function MainContainer() {

    
    return (
        <NavigationContainer>
            <Tab.Navigator
            initialRouteName={homeName}
            screenOptions= {({route}) => ({
                tabBarInactiveTintColor: 'grey',
                tabBarActiveTintColor: 'tomato',
                tabBarLabelStyle: { paddingBottom: 10, fontSize: 10},
                //tabBarStyle: { marginTop: 10},
                
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name

                    if (rn === homeName) {
                        iconName = focused ? 'home' : 'home-outline'
                    } else if (rn === favouritesName) {
                        iconName = focused ? 'heart' : 'heart-outline'
                    }

                    return <Ionicons name={iconName} size={size} color={color}/>
                },

            })}
            // screenOptions={{
            //     activeTintColor: 'tomato',
            //     inactiveTintColor: 'grey',
            //     labelStyle: { paddingBottom: 10, fontSize: 10},
            //     style: { padding: 10, height: 70 }
            // }}
            
            >
                <Tab.Screen name={homeName} component={HomeScreen}/>
                <Tab.Screen name={favouritesName} component={FavouritesScreen}/>

            </Tab.Navigator>
        </NavigationContainer>

    )
}

