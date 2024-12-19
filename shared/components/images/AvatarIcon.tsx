import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Rect, Path, Circle, G, Defs, ClipPath } from 'react-native-svg';
import { useThemeColor } from '@/shared/hooks';

interface AvatarIconProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export const AvatarIcon: React.FC<AvatarIconProps> = ({ 
  width = 81, 
  height = 80,
  style
}) => {
  const themeColors = useThemeColor();

  return (
    <View style={style}>
      <Svg width={width} height={height} viewBox="0 0 81 80" fill="none">
        <G clipPath="url(#clip0_4427_6452)">
          <Rect x="0.25" width="80" height="80" rx="40" fill={themeColors.extremeContrastGray} />
          <Path d="M10.25 65.7624C10.25 56.9258 17.4134 49.7624 26.25 49.7624H54.25C63.0866 49.7624 70.25 56.9258 70.25 65.7624V93.7624C70.25 102.599 63.0866 109.762 54.25 109.762H26.25C17.4134 109.762 10.25 102.599 10.25 93.7624V65.7624Z" fill={themeColors.gray1Gray04} />
          <Circle cx="40.25" cy="28" r="16" fill={themeColors.gray1Gray04 } />
        </G>
        <Defs>
          <ClipPath id="clip0_4427_6452">
            <Rect x="0.25" width="80" height="80" rx="40" fill="white" />
          </ClipPath>
        </Defs>
      </Svg>
    </View>
  );
};
