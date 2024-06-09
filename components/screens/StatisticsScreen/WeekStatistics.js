/* eslint-disable prettier/prettier */
import { StyleSheet, View, Text, Image, Pressable, ScrollView } from 'react-native';
import React, {useState, useEffect, useMemo} from 'react';
import { DynamicWidthBar } from '../../helpers/Charts/DynamicWidthBar';
import { getUsageStats } from '../../helpers/Time/UsageStats';
import { fetchInstalledApps } from '../../helpers/AppData/FetchingApps';
import { calculateHoursAndMinutes } from '../../helpers/Time/TimeUtils';
import { GenerateBarChart } from '../../helpers/Charts/BarChart';
import { screenTime } from '../../helpers/Time/ScreenTimeCalculator';
import resolveDate from '../../helpers/dateResolver';

export default function WeekStatistics({transfer}){
  const seriesData = [10, 15, 20, 25, 30, 35, 41];

    let [currentDate, setCurrentDate] = useState(new Date());
    let [formattedDate, setFormattedDate] = useState(null);

    useEffect(() => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
        const endOfWeek = new Date(currentDate);
        endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay()));
    
        const startMonth = startOfWeek.toLocaleString('default', { month: 'long' });
        const endMonth = endOfWeek.toLocaleString('default', { month: 'long' });
    
        const formattedStartDate = `${startMonth} ${startOfWeek.getDate()}`;
        const formattedEndDate = `${endMonth} ${endOfWeek.getDate()}`;
    
        setFormattedDate(`${formattedStartDate} - ${formattedEndDate}`);
    }, [currentDate]);

    const updateDate = (offset) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + offset);
        setCurrentDate(newDate);

        setEndTime(resolveDate(offset, endTime));
        setStartTime(resolveDate(offset, startTime));
      };
      
      const handlePreviousDate = () => {
        updateDate(-7);
      };
      
      const handleNextDate = () => {
        updateDate(7);
      };
      const maxEndtime = useMemo(() => {
        const currentDayOfWeek = currentDate.getDay();
        return resolveDate(-currentDayOfWeek + 7);
      }, []);

    const [endTime, setEndTime] = useState(() => {
      const currentDayOfWeek = currentDate.getDay();
      return resolveDate(-currentDayOfWeek + 7);
    });
    
    const [startTime, setStartTime] = useState(() => {
      const currentDayOfWeek = currentDate.getDay();
      return resolveDate(-currentDayOfWeek);
    });

    const [appUsages, setAppUsages] = useState([]);
    const [allTime, setAllTime] = useState(0);
    const [series, setSeries] = useState([]);
    const [installedApps, setInstalledApps] = useState([]);
    const [showAllApps, setShowAllApps] = useState(false);
    const [btnImg, setBtnImg] = useState(false);
    const toggleAppsVisibility = () => {
      setShowAllApps(!showAllApps);
      setBtnImg(!btnImg);
    };
    const memoizedBarChart = useMemo(() => <GenerateBarChart series={series}/>, [startTime, endTime, seriesData]);
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
    useEffect(() => {
      (async () => {
        try {
          const newSeries = [];
          const newStartDate = new Date(startTime);
          const newEndDate = new Date(startTime);
          newEndDate.setDate(newEndDate.getDate() + 0);
          newStartDate.setDate(newStartDate.getDate() - 1);
          for (var i = 0; i < 7; i++){
            newEndDate.setDate(newEndDate.getDate() + 1);
            newStartDate.setDate(newStartDate.getDate() + 1);
            const newEndDateTimestamp = newEndDate.getTime();
            const newStartDateTimestamp = newStartDate.getTime();
            const data = await getUsageStats(newStartDateTimestamp, newEndDateTimestamp);
            const updatedTime = Math.ceil(screenTime(data, installedApps) / 3600);
              newSeries.push(updatedTime);
          };

          setSeries(newSeries);
        } 
        catch (error) {
          console.error(error);
        }
      })();
    }, [appUsages]);

    useEffect(() => {
      const updatedTime = screenTime(appUsages, installedApps);
      setAllTime(updatedTime);
    }, [appUsages]);

    const renderAllApps = () => {
      const renderApps = [];
      const sortedApps = [...installedApps].sort((a, b) => {
        // Assuming that appUsages contains the screen time information for each app
        const timeA = appUsages.find((usage) => usage.app === a.packageName)?.time || 0;
        const timeB = appUsages.find((usage) => usage.app === b.packageName)?.time || 0;
        // Sort by screen time in descending order
        return timeB - timeA;
      });
      sortedApps.forEach((app, index) => {
        let time = 0;
        const found = appUsages.find((a) => a.app === app.packageName);
        
        if (found) {
          time = parseInt(found.time);
        }
        if (time > 0){
        const usedTime = calculateHoursAndMinutes(time);
        renderApps.push({
          appBlock: (
            <View key={`${index}`} style={styles.block}>
              <Image
                source={{ uri: `data:image/png;base64,${app.icon}` }}
                style={styles.img}
              />
              <Text style={styles.text}>{app.label}</Text>
              <View style={styles.numView2}>
                <Text style={styles.number2} />
              </View>
              <View style={styles.BarAndTime}>
              <DynamicWidthBar value={time} maxValue={14400} color={'#354171'} />
                <Text style={styles.time}>{usedTime}</Text>
              </View>
            </View>
          ),
          time: time,
        });
      }
      });
      // Sort renderApps array based on screen time in descending order
      renderApps.sort((a, b) => b.time - a.time);
      return renderApps.map((app) => app.appBlock);
    };
    const memoizedAllApps = useMemo(() => renderAllApps(), [appUsages]);
    const renderVisibleApps = showAllApps ? memoizedAllApps : memoizedAllApps.slice(0, 3);
    const renderImg = btnImg ? require('../../../assets/images/up.png') : require('../../../assets/images/down.png');
    return (
        <ScrollView vertically={true} style={styles.OuterContainer}>
           <View style={styles.dayAndWeek}>
           <Pressable
          style={[
            styles.topPartButton,
            { backgroundColor: '#010101' },
          ]}
          onPress={() => transfer()}
        >
          <Text
            style={[
              styles.topPartButtonText,
              { color: '#FFFFFF' },
              { fontWeight: '400' },
            ]}
          >
            Day
          </Text>
        </Pressable>
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
            Week
          </Text>
        </View>
      </View>
        <View style={styles.container}>
            <View style={styles.dateScreen}>
                <Pressable onPress={handlePreviousDate}>
                <Image source={require('../../../assets/images/arrowLeft.png')} style={styles.arrows}/>
                </Pressable>
                <Text style={styles.date}>{formattedDate}</Text>
                {maxEndtime !== endTime ?
              <Pressable onPress={handleNextDate}>
              <Image source={require('../../../assets/images/arrowRight.png')} style={styles.arrows}/>
              </Pressable> : <View style={styles.arrows}/>
              }
            </View>
            <View style={styles.Blocks}>
          <View style={styles.topPart}>
            <Text style={styles.BlockName}>Screen Time</Text>
            <Text style={styles.allTime}>{calculateHoursAndMinutes(allTime)}</Text>
          </View>
          {series.length > 0 && series.reduce((acc, val) => acc + val, 0) > 0 ? (
            memoizedBarChart
      ) : (
<View style={{ height: 220 }} />
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
  topPart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    lineHeight: 21,
    marginTop: 18,
    marginLeft: 25,
    marginRight: 25,
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
          marginLeft: 32,
          marginRight: 32,
          marginTop: 21,
          marginBottom: 27,
          justifyContent: 'space-between',
          alignContent: 'center',
          flexDirection: 'row',
      },
      arrows: {
          width: 18,
          height: 18,
      },
      date: {
          color: 'white',
          fontSize: 18,
          fontFamily: 'Roboto',
      },
      Blocks: {
          borderRadius: 17,
          backgroundColor: '#191C25',
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
});