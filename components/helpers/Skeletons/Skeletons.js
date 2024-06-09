import { Text, View } from "react-native";
import React from "react";
export function PieChartSkeleton() {
    return(
<View style={{height: 160, width: 160, alignSelf: 'center', borderRadius: 100, backgroundColor: '#262b38', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{height: 128, width: 128, alignSelf: 'center', borderRadius: 100, backgroundColor: '#191C25'}}/>
        </View>
    )
}
export function AppTimerSkeleton() {
    return(
<View><Text>Loading...</Text></View>
    )
}