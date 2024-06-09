import React from "react";
import { Dimensions } from "react-native";
import {BarChart} from "react-native-chart-kit";
const GenerateBarChart = ({series}) => {

    const screenWidth = Dimensions.get("window").width;
    return (
      <BarChart
        style={{
          paddingRight: 0,
          margin: 0,
        }}
        data={{
          labels: ["S", "M", "T", "W", "T", "F", "S"],
          datasets: [
            {
              data: series,
            },
          ],
        }}
        hideLegend={true}
        fromZero={true}
        width={screenWidth}
        height={220}
        showValuesOnTopOfBars={true}
        chartConfig={{
          style: {
            paddingRight: 50,
            justifyContent: "center",
          },
          fromZero: true,
          backgroundGradientFrom: "#191C25",
          backgroundGradientTo: "#191C25",
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
      />
    );
  };
  
  export {GenerateBarChart};