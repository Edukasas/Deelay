import Svg, { Rect } from 'react-native-svg';
import { View } from 'react-native';
import React from "react";
const DynamicBar = ({ segment1, segment2, color, style, height}) => {
const total = segment1 + segment2;
const normalizedSegment1 = (segment1 / total) * 100;
const normalizedSegment2 = (segment2 / total) * 100;
  return (
    <View style={style}>
      <Svg height="5" width="100%">
        <Rect x="0%" y="0" width={`${normalizedSegment1}%`} height={height} fill={color} />
        <Rect x={`${normalizedSegment1}%`} y="0" width={`${normalizedSegment2}%`} height={height} fill="#686B72" />
      </Svg>
    </View>
  );
};
export {DynamicBar};