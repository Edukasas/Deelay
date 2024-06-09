/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StyleSheet, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import EmptyAppContainer from '../HomeScreen/EmptyAppContainer';
import WithAppsContainer from '../HomeScreen/WithAppsContainer';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({navigation}) {
     navigation.setOptions({
    headerTitle: () => (
      <Image
        source={require('../../../assets/images/logo.png')}
        style={styles.logo}
      />
    ),
  });
  const MemoizedWithAppsContainer = React.memo(WithAppsContainer);
  const [isStoredDataAvailable, setIsStoredDataAvailable] = useState(false);
  const [rerenderToggle, setRerenderToggle] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setRerenderToggle((prev) => !prev);
    }, [])
  );
  useEffect(() => {
    (async () => {
      try {
        const storedData = await AsyncStorage.getItem('categories');
        const parsedData = JSON.parse(storedData) || []; // Parse the data, default to an empty array
       setIsStoredDataAvailable(parsedData.length > 0);
      } catch (error) {
        console.error('Error checking stored data:', error);
      }
    })();
  }, [rerenderToggle]);
return (

  <ScrollView vertically={true} style={styles.OuterContainer}>
  {isStoredDataAvailable ?
    <MemoizedWithAppsContainer/>
      :
      <EmptyAppContainer/>
      }
      </ScrollView>

); 
}


const styles = StyleSheet.create({
  OuterContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
   PieChart: {
      alignSelf: 'center',
   },
    Header: {
        backgroundColor: '#354171',
    },
    DynamicBar: {
      width: 150,
      alignSelf: 'flex-end',
    },
    logo: {
      width: 112,
      height: 48,
      marginTop: 10,
      marginLeft: 10,
      marginBottom: 11,
  },
  Container: {
    backgroundColor: 'black',
    flex: 1,
    gap: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
Blocks: {
    borderRadius: 17,
    backgroundColor: '#191C25',
  },
  topPart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    lineHeight: 21,
    marginTop: 18,
    marginLeft: 25,
    marginRight: 25,
  },
  allTime: {
    color: 'white',
  },
    BlockName: {
      fontFamily: 'Roboto-Regular',
      fontWeight: '700',
      fontSize: 18,
      marginBottom: 11,
      color: 'white',
    },
    block: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginLeft: 22,
      marginRight: 25,
      marginTop: 21,
      gap: 13,
      marginBottom: 15,
    },
    img: {
      width: 30,
      height: 30,
    },
    text: {
      fontWeight: '500',
      fontFamily: 'Roboto',
      fontSize: 13,
      color: 'white',
    },
    numView: {
      flex: 1,
      alignItems: 'flex-end',
    },
    number: {
      fontSize: 11,
      color: '#DDE1FF',
      backgroundColor: '#354171',
      borderRadius: 8,
      paddingBottom: 2,
      paddingTop: 2,
      paddingRight: 6,
      paddingLeft: 6,
    },
    numView2: {
      flex: 1,
      alignItems: 'flex-end',
    },
    number2: {
      fontSize: 11,
      color: '#191C25',
      backgroundColor: '#191C25',
      borderRadius: 8,
      paddingBottom: 2,
      paddingTop: 2,
      paddingRight: 6,
      paddingLeft: 6,
    },
    time: {
      textAlign: 'right',
      color: '#99999B',
      fontSize: 10,
    },
    BarAndTime: {
      alignItems: 'flex-end',
    },
});