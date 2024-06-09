/* eslint-disable prettier/prettier */
import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import DayStatistics from '../StatisticsScreen/DayStatistics';
import WeekStatistics from '../StatisticsScreen/WeekStatistics';
export default function StatisticsScreen({ navigation }) {
  const [activeButton, setActiveButton] = useState(true);
const transfer = () => {
  setActiveButton((prev) => !prev);
};
const MemoizedDayStatistics = React.memo(DayStatistics);
const MemoizedWeekStatistics = React.memo(WeekStatistics);
  return (
    <View style={styles.Container}>
            {activeButton ?  <MemoizedDayStatistics transfer={transfer} /> : <MemoizedWeekStatistics transfer={transfer} />
            }
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    backgroundColor: 'black',
    height: '100%',
  },
});
