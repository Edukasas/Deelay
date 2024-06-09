/* eslint-disable prettier/prettier */
import {Image, Text, StyleSheet, View, Dimensions} from 'react-native';
import React from 'react';
const windowHeight = Dimensions.get('window').height / 100 * 45;
export default function EmptyAppContainer(){
     return (
        <View style={styles.container}>
     <Image
        source={require('../../../assets/images/app_blocking.png')}
        style={styles.logo}
      />
            <Text style={styles.Text1}>No app limits created.</Text>
            <Text style={styles.Text2}>App limits enable you to use specific apps, block them for a set period, and then resume using them.</Text>
              </View>
      )}
const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 10,
      paddingHorizontal: 65,
      height: windowHeight,
    },
    Text1: {
        fontFamily: 'Roboto-Bold',
        color: 'white',
        fontSize: 16,
    },
    Text2: {
        color: '#94A3E4',
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 17,
    },
});
