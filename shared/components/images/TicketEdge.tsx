import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';
import { useThemeColor } from '@/shared/hooks/useThemeColor';

interface TicketEdgeProps {
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const TicketEdge = ({ color, style }: TicketEdgeProps) => {
  const themeColors = useThemeColor();

  return (
    <Svg
      width="100%"
      height="68"
      viewBox="0 0 120 20"
      preserveAspectRatio="none"
      style={style}
    >
      <Path
        d="M0 0 L6 8 L12 0 L18 8 L24 0 L30 8 L36 0 L42 8 L48 0 L54 8 L60 0 L66 8 L72 0 L78 8 L84 0 L90 8 L96 0 L102 8 L108 0 L114 8 L120 0 L120 20 L0 20 Z"
        fill={themeColors.backgroundColor}
        stroke={themeColors.borderBackgroundColor}
        strokeWidth="0.5"
      />
    </Svg>
  );
};
