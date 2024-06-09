/* eslint-disable prettier/prettier */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Screens
import HomeScreen from '../screens/MainScreens/HomeScreen';
import BlockedAppScreen from '../screens/MainScreens/BlockedAppListScreen';
import StatisticsScreen from '../screens/MainScreens/StatisticsScreen';
import { iconSources } from '../helpers/Icons/IconSources';
import { ActiveIcon} from '../helpers/Icons/IconComponents';
// Screen Names
const HomeName = 'Home';
const BlockedAppListName = 'Apps Blocked';
const StatisticsName = 'Statistics';

const Tab = createBottomTabNavigator();

const MyTheme = {
  colors: {
    background: '#354171',
    text: 'white',
  }
};

export default function Navbar() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator
        initialRouteName={HomeName}
        screenOptions={({ route }) => ({
          tabBarStyle: { height: 80, backgroundColor: '#354171'},
          tabBarLabelStyle: { paddingBottom: 16, fontFamily: 'Roboto-Medium' },
          tabBarIcon: ({ focused }) => {
            const rn = route.name;
            const iconSource = iconSources[rn];
          
            if (iconSource) {
              const source = focused ? iconSource.active : iconSource.inactive;
              return source ? <ActiveIcon source={source} /> : null;
            }
            return null;
          },
          tabBarActiveTintColor: 'white', 
        tabBarInactiveTintColor: '#DDE1FF',
        headerStyle: {
          height: 70
        },
        headerTitleStyle: {
          fontSize: 22,
          fontFamily: 'Roboto-Bold',
        },          
        })}
        
      >
        <Tab.Screen name={HomeName} component={HomeScreen} />
        <Tab.Screen name={BlockedAppListName} component={BlockedAppScreen} />
        <Tab.Screen name={StatisticsName} component={StatisticsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
