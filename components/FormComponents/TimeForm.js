/* eslint-disable prettier/prettier */
import {Image, Text, StyleSheet, View, ScrollView, Pressable, TextInput  } from 'react-native';
import React, { useState,useEffect} from 'react';
import { useTemporaryContext } from '../helpers/AppData/TemporaryContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { loadCategories } from '../helpers/AppData/LoadDataFromStorage';

export default function TimeForm({ update, returnToApps }){
        const { temporaryState, temporaryDispatch } = useTemporaryContext();
        const [categories, setCategories] = useState([]);
        const usageMinutes = temporaryState.usageTimeMinutes;
        const usageSeconds = temporaryState.usageTimeSeconds;
        const blockedMinutes = temporaryState.blockedTimeMinutes;
        const blockedSeconds = temporaryState.blockedTimeSeconds;
        const isEditing = temporaryState.editingCategory;
        const customCategoryName = temporaryState.customCategoryName;
        const isValidInput = (text) => /^\d+$/.test(text) || text === '';
        useEffect(() => {
          loadCategories(setCategories);
        }, []);
        
        const handleSubmit = async() => {
          if ((usageMinutes || usageSeconds) && (blockedMinutes || blockedSeconds)){
            const parsedUsageMinutes = parseInt(usageMinutes) || 0;
            const parsedUsageSeconds = parseInt(usageSeconds) || 0;
            const parsedBlockedMinutes = parseInt(blockedMinutes) || 0;
            const parsedBlockedSeconds = parseInt(blockedSeconds) || 0;
            const usageTime = parsedUsageMinutes * 60 + parsedUsageSeconds;
            const blockedTime = parsedBlockedMinutes * 60 + parsedBlockedSeconds;
                  const newCategory = {
                    customCategoryName: customCategoryName,
                    selectedApps: temporaryState.selectedApps,
                    parsedUsageMinutes,
                    parsedUsageSeconds,
                    parsedBlockedMinutes,
                    parsedBlockedSeconds,
                    usageTime,
                    blockedTime,
                  };
                  if (isEditing) {
                   // Editing existing category
                    const updatedCategories = categories.map((existingCategory) =>
                      existingCategory.customCategoryName === temporaryState.editingCategoryKey
                        ? { ...existingCategory, ...newCategory }
                        : existingCategory
                    );
                    await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
                    setCategories(updatedCategories);
                  }
                   else {
                    // Creating a new category
                    try {
                      const updatedCategories = [...categories, newCategory];
                      await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
                      setCategories(updatedCategories);
                    } catch (error) {
                      console.error('Error saving state to AsyncStorage:', error);
                    }
                  }
                    update();
          }
          else{
            alert('Input Value');
          }
        };
          const handleCancel = () => {
            temporaryDispatch({ type: 'COMING_BACK_WHEN_EDITING', payload: false});
            returnToApps();
            };
            const handleUsageMinutes = (text) => {
              if (isValidInput(text)) {
                temporaryDispatch({ type: 'USAGE_TIME_MINUTES', payload: text});
              } else {
                console.error('Invalid input. Please enter only numeric values.');
              }
            };
            const handleUsageSeconds = (text) => {
              if (isValidInput(text)) {
                temporaryDispatch({ type: 'USAGE_TIME_SECONDS', payload: text});
              } else {
                console.error('Invalid input. Please enter only numeric values.');
              }
            };
            const handleBlockedMinutes = (text) => {
            if (isValidInput(text)) {
              temporaryDispatch({ type: 'BLOCKED_TIME_MINUTES', payload: text});
            } else {
              console.error('Invalid input. Please enter only numeric values.');
            }
          };
          const handleBlockedSeconds = (text) => {
            if (isValidInput(text)) {
              temporaryDispatch({ type: 'BLOCKED_TIME_SECONDS', payload: text});
            } else {
              console.error('Invalid input. Please enter only numeric values.');
            }
          };
    return (


      <KeyboardAwareScrollView
      contentContainerStyle={styles.timeContainer}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
    >
              <View style={styles.topPart}>
        <Pressable onPress={handleCancel} style={styles.cancel}>
        <Image
        source={require('../../assets/images/back.png')}
      />
      </Pressable>
        <Text style={styles.button}>Enter time</Text>
        <Pressable onPress={handleSubmit} style={styles.next}>
           <Image
        source={require('../../assets/images/add.png')}
      /></Pressable>
      </View>
      <Text style={styles.h1}>Usage Time</Text>
      <View style={styles.biggerblock}>
        <View>
        <TextInput
        keyboardType="numeric"
        value={temporaryState.usageTimeMinutes}
        onChangeText={handleUsageMinutes}
        maxLength={2}
        style={styles.block1}
        placeholder="00"
        placeholderTextColor={styles.placeholderStyleMinutes.color}
      />
      <Text style={styles.name}>Minute</Text>
      </View>
      <Text style={styles.semicolon}>:</Text>
      <View>
        <TextInput
        keyboardType="numeric"
        value={temporaryState.usageTimeSeconds}
        onChangeText={handleUsageSeconds}
        maxLength={2}
        style={styles.block2}
        placeholder="00"
        placeholderTextColor={styles.placeholderStyleSeconds.color}
      />
      <Text style={styles.name}>Second</Text>
      </View>
      </View>
      <Text style={styles.h1}>Block Time</Text>
      <View style={styles.biggerblock}>
        <View>
        <TextInput
        keyboardType="numeric"
        value={temporaryState.blockedTimeMinutes}
        onChangeText={handleBlockedMinutes}
        maxLength={2}
        style={styles.block1}
        placeholder="00"
        placeholderTextColor={styles.placeholderStyleMinutes.color}
      />
      <Text style={styles.name}>Minute</Text>
      </View>
      <Text style={styles.semicolon}>:</Text>
      <View>
        <TextInput
        keyboardType="numeric"
        value={temporaryState.blockedTimeSeconds}
        onChangeText={handleBlockedSeconds}
        maxLength={2}
        style={styles.block2}
        placeholder="00"
        placeholderTextColor={styles.placeholderStyleSeconds.color}
      />
      <Text style={styles.name}>Second</Text>
      </View>
      </View>
        </KeyboardAwareScrollView>
);
}
const styles = StyleSheet.create({
  placeholderStyleSeconds: {
    color: 'white',
  },
  placeholderStyleMinutes: {
    color: '#94A3E4',
  },
    biggerblock: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    semicolon: {
        color: '#BBC4EC',
        fontSize: 57,
        marginLeft: 10,
        marginRight: 10,
    },
    name: {
        color: '#BBC4EC',
        marginTop: 7,
        textAlign: 'right',
    },
    block2: {
        paddingBottom: 9,
          paddingTop: 9,
          paddingRight: 20,
          paddingLeft: 20,
          fontSize: 45,
          color: 'white',
          backgroundColor: '#94A3E4',
          borderRadius: 8,
          gap: 1,
          borderWidth: 2,
          borderColor: '#94A3E4',
          width: 96,
          textAlign: 'right',
    },
    block1: {
        paddingBottom: 9,
          paddingTop: 9,
          paddingRight: 20,
          paddingLeft: 20,
          fontSize: 45,
          color: '#94A3E4',
          backgroundColor: '#354171',
          borderRadius: 8,
          gap: 1,
          borderWidth: 2,
          borderColor: '#94A3E4',
          width: 96,
          textAlign: 'right',
    },
    timeContainer: {
        backgroundColor: '#191C25',
        borderRadius: 17,
        width: '100%',
        height: 600,
        marginTop: 20,
        alignSelf: 'center',
      },
      button: {
        color: '#BBC4EC',
        fontSize: 16,
    },
    h1: {
        color: '#BBC4EC',
        fontSize: 16,
        marginLeft: 50,
        marginTop: 40,
        marginBottom: 40,
    },
    next: {
        alignSelf: 'center',
      },
      cancel: {
        alignSelf: 'center',
      },
      topPart: {
        borderTopLeftRadius: 17,
        borderTopRightRadius: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: 'black',
        marginLeft: 20,
        marginRight: 20,
        paddingTop: 21,
        paddingBottom: 16,
    },
});