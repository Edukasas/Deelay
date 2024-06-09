/* eslint-disable prettier/prettier */
import {StyleSheet, Image, Text, View, ScrollView} from 'react-native';
import React, { useEffect, useState, useMemo, Suspense, lazy } from 'react';
import { DynamicBar } from '../../helpers/Charts/DynamicBar';
import { getUsageStats } from '../../helpers/Time/UsageStats';
import { fetchInstalledApps } from '../../helpers/AppData/FetchingApps';
import { loadCategories } from '../../helpers/AppData/LoadDataFromStorage';
import { calculateHoursAndMinutes } from '../../helpers/Time/TimeUtils';
import { generateCategoryColors } from '../../helpers/Colors/ColorUtils';
import {PieChartSkeleton, AppTimerSkeleton} from '../../helpers/Skeletons/Skeletons';

export default function WithAppsContainer() {
  const { startTime, endTime } = useMemo(() => {
    const currentTime = new Date();
    const start = new Date();
    start.setMinutes(0);
    start.setHours(0);
    const startTime = start.getTime();
    return { startTime, endTime: currentTime.getTime() };
  }, []);

  const LazyPieChart = lazy(() => import('../../helpers/Charts/LazyPieChart'));
  const [appUsages, setAppUsages] = useState([]);
  const [allTime, setAllTime] = useState(0);
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [installedApps, setInstalledApps] = useState([]);
  const [allTimeCalculated, setAllTimeCalculated] = useState(false);
  const widthAndHeight = 160;
  const categoryColors = useMemo(() => generateCategoryColors(categories.length), [categories]);
  useEffect(() => {
    (async () => {
      try {
        await loadCategories(setCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    })()
  }, [appUsages]);
  
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
    fetchInstalledApps(setInstalledApps);
  }, []);

  useEffect(() => {
    const newSeries = [];
    let updatedTime = 0;
    if (categories !== null) {
      categories.forEach((category) => {
        let time = 0;
        category?.selectedApps.forEach((app) => {
          const found = appUsages.find((a) => a.app === app);
          if (found) {
            time += parseInt(found.time);
          }
        });
        newSeries.push(time);
        updatedTime += time;
      });
    }
      setSeries(newSeries);
      setAllTimeCalculated(true);
      setAllTime(updatedTime);
  }, [allTimeCalculated, categories]);

 

  const renderCategoryBlocks = () => {
    if (categories === null) {
      return null;
    }

    const renderBlocks = categories.map((category, index) => {
      const firstSelectedAppPackage = category?.selectedApps[0];
      let time = 0;
      let usageTime = category.usageTime;
      category?.selectedApps.map(app => {
        let found = appUsages.filter(a => a.app === app);
        if (found && found.length > 0) {
          time += parseInt(found[0].time);
        }
      });
      const firstSelectedApp = installedApps.find(value => value.packageName === firstSelectedAppPackage);
      const appLength = category.selectedApps.length;
      const moreThanOneApp = appLength > 1;
      const usedTime = calculateHoursAndMinutes(time);
      const leftTime = calculateHoursAndMinutes(usageTime);
      return (
        <View key={index} style={styles.block} >
          <Image
            source={{ uri: `data:image/png;base64,${firstSelectedApp?.icon}` }}
            style={styles.img}
          />
          <Text style={styles.text}>{category?.customCategoryName}</Text>
              { moreThanOneApp ?
            <View style={styles.numView}>
              <Text style={styles.number}>{appLength}</Text>
            </View> :
            <View style={styles.numView2}>
            <Text style={styles.number2}>{appLength}</Text>
          </View>
            }
            <View style={styles.BarAndTime}>
                <DynamicBar segment1={time} segment2={usageTime - time} color={categoryColors[index]} style={styles.DynamicBar} height={9}/>
                <Text style={styles.time}>{usedTime} / {leftTime}</Text>
               </View>
        </View>
      );
  });
  return renderBlocks;
};



const renderAllApps = () => {
  if (categories === null) {
    return null;
  }

  const renderApps = [];
  
  categories.forEach((category, categoryIndex) => {
    category.selectedApps.forEach((app, appIndex) => {
      let time = 0;
      let usageTime = category.usageTime;
      const found = appUsages.find((a) => a.app === app);

      if (found) {
        time = parseInt(found.time);
      }

      const appDetails = installedApps.find((value) => value.packageName === app);
      const usedTime = calculateHoursAndMinutes(time);
      const leftTime = calculateHoursAndMinutes(usageTime);

      renderApps.push(
        <View key={`${categoryIndex}-${appIndex}`} style={styles.block}>
          <Image
            source={{ uri: `data:image/png;base64,${appDetails?.icon}` }}
            style={styles.img}
          />
          <Text style={styles.text}>{appDetails?.label}</Text>
          <View style={styles.numView2}>
            <Text style={styles.number2}/>
          </View>
          <View style={styles.BarAndTime}>
            <DynamicBar
              segment1={time}
              segment2={usageTime - time}
              color={'#95A4E5'}
              style={styles.DynamicBar}
              height={9}
            />
            <Text style={styles.time}>{usedTime} / {leftTime}</Text>
          </View>
        </View>
      );
    });
  });
  return renderApps;
};

const memoizedCategoryBlocks = useMemo(() => renderCategoryBlocks(), [categories]);
const memoizedAllApps = useMemo(() => renderAllApps(), [categories]);


return (
  <ScrollView vertically={true} style={styles.OuterContainer}>

      <View style={styles.Container}>
        <View style={styles.Blocks}>
          <View style={styles.topPart}>
            <Text style={styles.BlockName}>Screen Time</Text>
            <Text style={styles.allTime}>{calculateHoursAndMinutes(allTime)}</Text>
          </View>
          {categoryColors.length === series.length && series.length > 0 && series.reduce((acc, val) => acc + val, 0) > 0 ? (

       
        <LazyPieChart
          style={styles.PieChart}
          widthAndHeight={widthAndHeight}
          series={series}
          sliceColor={categoryColors}
          coverRadius={0.80}
          coverFill={'#191C25'}
        />

      ) : (
        <PieChartSkeleton/>
      )}
          {memoizedCategoryBlocks}
        </View>
        <View style={styles.Blocks}>
          <View style={styles.topPart}>
            <Text style={styles.BlockName}>App timers</Text>
          </View>
          {memoizedAllApps}
        </View>
      </View>
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
      marginLeft: 17,
      marginRight: 17,
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