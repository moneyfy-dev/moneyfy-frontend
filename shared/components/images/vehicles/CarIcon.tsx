import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';
import { useThemeColor } from '@/shared/hooks';

interface CarIconProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export const CarIcon: React.FC<CarIconProps> = ({ 
  width = 127, 
  height = 51,
  style
}) => {
  const themeColors = useThemeColor();

  return (
    <Svg width={width} height={height} style={style} viewBox="0 0 127.27 51.26">
      {/* Cuerpo principal del carro */}
      <Path 
        d="M127.27,35.9a7.54,7.54,0,0,1-7.54,7.54h-7.06a11.63,11.63,0,0,0,.16-1.88,11.36,11.36,0,1,0-22.71,0,11.63,11.63,0,0,0,.15,1.88H37.54a11.63,11.63,0,0,0,.16-1.88,11.36,11.36,0,1,0-22.71,0,11.63,11.63,0,0,0,.15,1.88H7.54A7.55,7.55,0,0,1,0,35.9V22.56A7.54,7.54,0,0,1,7.54,15l2.72,0h.2a19.86,19.86,0,0,0,13.17-5C31,3.58,42,0,50.16,0,77.19,0,84.89,11.91,92,15.41s15.52,3.93,18.22,4.27a19.08,19.08,0,0,1,12.09,4.7A15.21,15.21,0,0,1,127.27,35.9Z"
        fill={themeColors.green1to2}
      />

      {/* Ventana izquierda */}
      <Path 
        d="M52,3.44h.87V19.13H31.44a3.9,3.9,0,0,1-3.37-5.81l0-.05C33.63,5.5,47.43,3.44,52,3.44Z"
        fill={themeColors.green4to5}
      />

      {/* Ventana derecha */}
      <Path 
        d="M85.27,19.13H55.68V3.61c11.49,1.11,22,7.05,27.06,10.75L86,16.75A1.32,1.32,0,0,1,85.27,19.13Z"
        fill={themeColors.green4to5}
      />

      {/* Rueda izquierda exterior */}
      <Circle 
        cx="26.34" 
        cy="41.56" 
        r="9.71" 
        fill={themeColors.green4to5}
        transform="translate(-20.16 57.65) rotate(-76.72)"
      />

      {/* Rueda izquierda interior */}
      <Path 
        d="M31.57,41.56a5.23,5.23,0,1,1-5.23-5.23A5.23,5.23,0,0,1,31.57,41.56Z"
        fill={themeColors.green1to2}
      />

      {/* Rueda derecha exterior */}
      <Circle 
        cx="101.73" 
        cy="41.56" 
        r="9.71" 
        fill={themeColors.green4to5}
        transform="translate(-8.16 42.09) rotate(-22.5)"
      />

      {/* Rueda derecha interior */}
      <Path 
        d="M107,41.56a5.23,5.23,0,1,1-5.23-5.23A5.23,5.23,0,0,1,107,41.56Z"
        fill={themeColors.green1to2}
      />
    </Svg>
  );
};