import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface SuvIconProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export const SuvIcon: React.FC<SuvIconProps> = ({ 
  width = 135, 
  height = 65,
  style
}) => {
  const themeColors = useThemeColor();

  return (
    <Svg width={width} height={height} style={style} viewBox="0 0 134.9 64.71">
      {/* Barra lateral izquierda */}
      <Rect 
        y="10.04" 
        width="11.92" 
        height="29.75" 
        rx="4.03"
        fill={themeColors.green4to5}
      />

      {/* Cuerpo principal del SUV */}
      <Path 
        d="M132.33,49.83h-7.16a16.85,16.85,0,0,0-33.62,0H52a16.85,16.85,0,0,0-33.61,0H8.87V26.72a19.41,19.41,0,0,1,1-6.23L15.65,3.41A5,5,0,0,1,20.4,0H77.88a5.65,5.65,0,0,1,4.05,1.71L91,11c7.75,8,13.18,10.1,19.5,12.1,4.13,1.3,12.2,2.47,17.3,3.12a5.24,5.24,0,0,1,4.58,5.2Z"
        fill={themeColors.green1to2}
      />

      {/* Detalles inferiores */}
      <Rect x="7.74" y="47.39" width="10.63" height="4.88" rx="0.81" fill={themeColors.green4to5} />
      <Rect x="52.02" y="47.39" width="39.51" height="4.88" rx="1.57" fill={themeColors.green4to5} />
      <Rect x="125.28" y="47.39" width="9.62" height="4.88" rx="0.77" fill={themeColors.green4to5} />

      {/* Ventana izquierda */}
      <Path 
        d="M47.79,4.79V21.25a1.19,1.19,0,0,1-1.19,1.19H18.83a1.19,1.19,0,0,1-1.13-1.58L23.25,4.41a1.2,1.2,0,0,1,1.13-.81H46.6A1.19,1.19,0,0,1,47.79,4.79Z"
        fill={themeColors.green3to4}
      />

      {/* Ventana derecha */}
      <Path 
        d="M91.27,22.44H56.67a1.19,1.19,0,0,1-1.2-1.19V4.79a1.19,1.19,0,0,1,1.2-1.19H72.93a6.87,6.87,0,0,1,4.91,2.07L92.13,20.42A1.19,1.19,0,0,1,91.27,22.44Z"
        fill={themeColors.green3to4}
      />

      {/* Rueda izquierda exterior */}
      <Circle 
        cx="35.18" 
        cy="51.04" 
        r="13.67" 
        transform="translate(-20.84 77.58) rotate(-80.78)"
        fill={themeColors.green4to5}
      />

      {/* Rueda izquierda interior */}
      <Circle cx="35.18" cy="51.04" r="7.36" fill={themeColors.green1to2} />

      {/* Rueda derecha exterior */}
      <Circle 
        cx="108.39" 
        cy="51.04" 
        r="13.67" 
        transform="translate(-4.34 91.59) rotate(-45)"
        fill={themeColors.green4to5}
      />

      {/* Rueda derecha interior */}
      <Circle cx="108.39" cy="51.04" r="7.36" fill={themeColors.green1to2} />
    </Svg>
  );
};