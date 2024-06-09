/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native';
import React, { useEffect, useState, useMemo} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DynamicBar } from '../../helpers/Charts/DynamicBar';
import { getUsageStats } from '../../helpers/Time/UsageStats';
import { fetchInstalledApps } from '../../helpers/AppData/FetchingApps';
import { loadCategories } from '../../helpers/AppData/LoadDataFromStorage';
import { calculateHoursAndMinutes } from '../../helpers/Time/TimeUtils';

export default function WithAppContainer({setIsStoredDataAvailable, editCategory}) {
  const { startTime, endTime } = useMemo(() => {
    const currentTime = new Date();
    const start = new Date();
    start.setMinutes(0);
    start.setHours(0);
    const startTime = start.getTime();
    return { startTime, endTime: currentTime.getTime() };
  }, []);
  const [appUsages, setAppUsages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [installedApps, setInstalledApps] = useState([]);

  const handleDeleteCategory = async (category) => {
    try {
      // Remove the category from the state
      const updatedCategories = categories.filter((cat) => cat !== category);
      setCategories(updatedCategories);
      // Save the updated categories to AsyncStorage
      await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
      setIsStoredDataAvailable(updatedCategories.length > 0);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const data = await getUsageStats(startTime, endTime);
        setAppUsages(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [startTime, endTime]);
  
  useEffect(() => {
    (async () => {
      await loadCategories(setCategories);
    })();

    fetchInstalledApps(setInstalledApps);
  }, []);
  
  const renderCategoryBlocks = () => {
    if (categories === null) {
      return null;
    }
    return categories.map((category, index) => {
      const firstSelectedAppPackage = category?.selectedApps[0];
      let time = 0;
      let usageTime = category.usageTime;
      category?.selectedApps.map(app => {
        let found = appUsages.filter(a => a.app === app);
        if (found && found.length > 0) {
          time += parseInt(found[0].time);
        }
      })
      const firstSelectedApp = installedApps.find(value => value.packageName === firstSelectedAppPackage);
      const isSelected = selectedCategory === category;
      const appLength = category.selectedApps.length;
      const moreThanOneApp = appLength > 1;
      const selectedBorderStyle = isSelected ? styles.selectedBorder : {};
      const usedTime = calculateHoursAndMinutes(time);
      const leftTime = calculateHoursAndMinutes(usageTime);
      return (
        <View key={index} style={styles.block} >
           <TouchableOpacity
           style={styles.topBlock}
          onPress={() => setSelectedCategory(isSelected ? null : category)}
        >
          <Image
            source={{ uri: `data:image/png;base64,${firstSelectedApp?.icon}` }}
            style={styles.img}
          />
          <View style={[styles.border, index === categories.length - 1 && styles.lastBorder, selectedBorderStyle]}>
              <View style={styles.innerTopContainer}>
              <Text style={styles.text}>{category?.customCategoryName}</Text>
              { moreThanOneApp ?
            <View style={styles.numView}>
              <Text style={styles.number}>{appLength}</Text>
            </View> :
            <View/>
            }
            </View>
 <DynamicBar segment1={time} segment2={usageTime - time} color={'#95A4E5'} style={styles.innerMidContainer} height={5}/>
            <View style={styles.innerBottomContainer}>
              <Text style={styles.time}>{usedTime} / {leftTime}</Text>
            </View>
        </View>
        </TouchableOpacity>
         {isSelected && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={() => editCategory(category)}
              style={styles.biggerBlock}
            >
              <Image source={require('../../../assets/images/edit.png')}/>
              <Text style={styles.Buttons}>Edit</Text>
            </TouchableOpacity>
            <View style={styles.verticalLine} />
            <TouchableOpacity
              onPress={() => handleDeleteCategory(category)}
              style={styles.biggerBlock}
            >
              <Image source={require('../../../assets/images/delete.png')}/>
              <Text style={styles.Buttons}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        </View>
      );
    });
  };
  const memoizedCategoryBlocks = useMemo(() => renderCategoryBlocks(), [categories, selectedCategory, appUsages]);
  return (
    <ScrollView style={styles.scrollViewContainer}>
    {memoizedCategoryBlocks}
  </ScrollView>
  );
}
const styles = StyleSheet.create({
  time: {
    color: '#99999B',
  },
  innerBottomContainer: {
    marginBottom: 15,
  },
  innerMidContainer: {
    width: '100%',
    height: 5,
    backgroundColor: '#686B72',
    borderRadius: 10,
  },
  innerTopContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  selectedBorder: {
    borderBottomWidth: 0,
  },
  verticalLine: {
    height: '80%',
    width: 1,
    backgroundColor: '#3A3D44',
    marginHorizontal: 10,
  },
  border: {
    borderBottomWidth: 1,
    borderColor: '#3A3D44',
    flex: 1,
    flexDirection: 'collumn',
    justifyContent: 'space-between',
    gap: 5,
  },
  scrollViewContainer: {
    maxHeight: 600,
    borderRadius: 17,
    marginTop: 10,
    backgroundColor: '#191C25',
  },
  Container: {
    backgroundColor: '#191C25',
    marginTop: 10,
    borderRadius: 17,
  },
  lastBorder: {
    borderBottomWidth: 0,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  biggerBlock: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    marginBottom: 10,
    gap: 10,
  },
  Buttons: {
    color:'#BBC4EC',
    fontSize: 14,
  },
  topBlock: {
    flexDirection: 'row',
    gap: 18,
  },
  block: {
    marginRight: 22,
  },
  numView: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  number: {
    fontSize: 11,
    color: '#A7AABD',
    backgroundColor: '#010101',
    borderRadius: 8,
    paddingBottom: 2,
    paddingTop: 2,
    paddingRight: 6,
    paddingLeft: 6,
    marginTop: 16,
  },
  img: {
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 10,
    width: 50,
    height: 50,
  },
  text: {
    marginTop: 16,
    fontFamily: 'Roboto',
    fontSize: 16,
    color: 'white',
  },
});
