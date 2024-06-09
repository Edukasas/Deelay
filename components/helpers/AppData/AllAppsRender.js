// AllAppsRenderer.js
import React, { useMemo } from 'react';
import { View, Image, Text } from 'react-native';
import { DynamicWidthBar } from '../Charts/DynamicWidthBar';
import { calculateHoursAndMinutes } from '../Time/TimeUtils';

const AllAppsRenderer = ({ categories, appUsages, installedApps, styles }) => {
  const renderApps = useMemo(() => {
    if (categories === null) {
      return null;
    }

    const renderedApps = [];

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
    
          renderedApps.push(
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
                <DynamicWidthBar
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

    return renderedApps;
  }, [categories, appUsages, installedApps, styles]);

  return renderApps;
};

export default AllAppsRenderer;
