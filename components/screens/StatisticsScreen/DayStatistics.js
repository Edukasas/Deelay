/* eslint-disable prettier/prettier */
import { StyleSheet, View, Text, Image, Pressable, ScrollView } from 'react-native';
import React, {useState, useEffect, useMemo} from 'react';
import { DynamicWidthBar } from '../../helpers/Charts/DynamicWidthBar';
import { getUsageStats } from '../../helpers/Time/UsageStats';
import { fetchInstalledApps } from '../../helpers/AppData/FetchingApps';
import { calculateHoursAndMinutes } from '../../helpers/Time/TimeUtils';
import { generateCategoryColors } from '../../helpers/Colors/ColorUtils';
import resolveDate from '../../helpers/dateResolver';
import FastImage from 'react-native-fast-image';
import PieChart from 'react-native-pie-chart';
export default function DayStatistics({transfer}){
    const [currentDate, setCurrentDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState(null);
    
    const maxEndTime = useMemo(() => {
       return resolveDate(1);
    }, []);

    const [endTime, setEndTime] = useState(() => {
      return resolveDate(1);
    });
    const [startTime, setStartTime] = useState(() => {
      return resolveDate(0);
    });
   
    useEffect(() => {
        setFormattedDate(`${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getDate()}`);
    }, [currentDate]);
 
    const updateDate = (offset) => {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + offset);
      setCurrentDate(newDate);
    
      setEndTime(resolveDate(offset, endTime));
      setStartTime(resolveDate(offset, startTime));
    };
    
    const handlePreviousDate = () => {
      updateDate(-1);
    };
    
    const handleNextDate = () => {
      updateDate(1);
    };
    const [appUsages, setAppUsages] = useState([]);
    const [allTime, setAllTime] = useState(0);
    const [series, setSeries] = useState([]);
    const [installedApps, setInstalledApps] = useState([]);
    const widthAndHeight = 160;
    const appColor = useMemo(() => generateCategoryColors(series.length), [series]);
    const [showAllApps, setShowAllApps] = useState(false);
    const [btnImg, setBtnImg] = useState(false);
    const toggleAppsVisibility = () => {
      setShowAllApps(!showAllApps);
      setBtnImg(!btnImg);
    };

    useEffect(() => {
      fetchInstalledApps(setInstalledApps);
    }, []);
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
      const memoizedRenderApps = useMemo(() => {
        const dataMap = {};
        const updatedTime = installedApps.reduce((acc, app) => {
          const found = appUsages.find((a) => a.app === app.packageName);
          if (found) {
            dataMap[app.packageName] = {
              time: parseInt(found.time),
              label: app.label,
              icon: app.icon,
            };
            return acc + parseInt(found.time);
          }
          return acc;
        }, 0);

          const sortedObject = Object.values(dataMap).sort((a, b) => b.time - a.time);
          const sortedSeries = Object.values(dataMap).map(data => data.time).sort((a, b) => b - a);
        setSeries(sortedSeries);
        setAllTime(updatedTime);
        const barColor =  generateCategoryColors(sortedSeries.length);
        const renderApps = [];
        for (let i = 0; i < sortedObject.length; i++) {
          const time = parseInt(Object.values(sortedObject)[i].time);
          const usedTime = calculateHoursAndMinutes(time);
          const currentApp = Object.values(sortedObject)[i];
          renderApps.push(
            <View key={`${i}`} style={styles.block}>
              <FastImage
                source={{ uri: `data:image/png;base64,${currentApp.icon}` }}
                style={styles.img}
              />
              <Text style={styles.text}>{currentApp.label}</Text>
              <View style={styles.numView2}>
                <Text style={styles.number2} />
              </View>
              <View style={styles.BarAndTime}>
                <DynamicWidthBar value={time} maxValue={14400} color={barColor[i]} />
                <Text style={styles.time}>{usedTime}</Text>
              </View>
            </View>
          );
        }
        return renderApps;
      }, [appUsages]);
     const renderVisibleApps = showAllApps ? memoizedRenderApps : memoizedRenderApps.slice(0, 3);
    const renderImg = btnImg ? require('../../../assets/images/up.png') : require('../../../assets/images/down.png');
  
    return (
      <ScrollView vertically={true} style={styles.OuterContainer}>
              <View style={styles.dayAndWeek}>
        <View
          style={[
            styles.topPartButton,
            { backgroundColor:'#191C25'},
          ]}
        >
          <Text
            style={[
              styles.topPartButtonText,
              { color:'#BBC4EC'},
              { fontWeight: '700'},
            ]}
          >
            Day
          </Text>
        </View>
        <Pressable
          style={[
            styles.topPartButton,
            { backgroundColor: '#010101' },
          ]}
          onPress={() => {
            transfer();
          }}
        >
          <Text
            style={[
              styles.topPartButtonText,
              { color: '#FFFFFF' },
              { fontWeight: '400' },
            ]}
          >
            Week
          </Text>
        </Pressable>
      </View>
        <View style={styles.container}>
            <View style={styles.dateScreen}>
                <View style={styles.pressableWrapper}>
                    <Pressable onPress={handlePreviousDate}>
                    <FastImage source={require('../../../assets/images/arrowLeft.png')} style={styles.arrows}/>
                    </Pressable>
                </View>
                <Text style={styles.date}>{formattedDate}</Text>
                {maxEndTime !== endTime ?
                  <View style={styles.pressableWrapper}>
                  <Pressable onPress={handleNextDate}>
                  <FastImage source={require('../../../assets/images/arrowRight.png')} style={styles.arrows}/>
                  </Pressable>
              </View> : <View style={styles.pressableWrapper}><View style={styles.arrows}/></View> }
            </View>
            <View style={styles.Blocks}>
          <View style={styles.topPart}>
            <Text style={styles.BlockName}>Screen Time</Text>
            <Text style={styles.allTime}>{calculateHoursAndMinutes(allTime)}</Text>
          </View>
          {series.reduce((acc, val) => acc + val, 0) > 0 ? (
        <PieChart
          style={styles.PieChart}
          widthAndHeight={widthAndHeight}
          series={series}
          sliceColor={appColor}
          coverRadius={0.80}
          coverFill={'#191C25'}
        />
      ) : (
        <View/>
      )}
          {renderVisibleApps}
          {series.length > 3 ?
          <Pressable onPress={toggleAppsVisibility} style={styles.button}>
              <Image source={renderImg} style={styles.buttonImg}/>
            </Pressable>
            : <></>}
        </View>
        </View>
      </ScrollView>
    );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  dayAndWeek: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 16,
  },
  topPartButton: {
    color: '#BBC4EC',
    backgroundColor: '#191C25',
    fontSize: 14,
    fontWeight: '700',
    borderRadius: 17,
    margin: 5,
  },
  topPartButtonText: {
    marginRight: 65,
    marginLeft: 65,
    marginTop: 9,
    marginBottom: 9,
    textAlign: 'center',
  },
  pressableWrapper: {
    padding: 10,
  },
    buttonImg: {
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 12,
    },
    button: {
      marginLeft: 17,
      marginRight: 17,
      borderTopWidth: 1,
      borderColor: '#3A3D44',
    },
    dateScreen: {
        marginLeft: 22,
        marginRight: 22,
        marginTop: 11,
        marginBottom: 17,
        justifyContent: 'space-between',
        alignContent: 'center',
        flexDirection: 'row',
    },
    arrows: {
        width: 18,
        height: 18,
    },
    date: {
      paddingTop: 10,
      paddingBottom: 10,
        color: 'white',
        fontSize: 18,
        fontFamily: 'Roboto',
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
          alignItems: 'center',
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
        DynamicBar: {
            width: 150,
            alignSelf: 'flex-end',
          },
          PieChart: {
            alignSelf: 'center',
         },
});