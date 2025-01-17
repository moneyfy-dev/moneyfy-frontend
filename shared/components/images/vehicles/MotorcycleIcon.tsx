import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { ViewStyle } from 'react-native';
import { useThemeColor } from '../../../hooks/useThemeColor';

interface MotorcycleIconProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export const MotorcycleIcon: React.FC<MotorcycleIconProps> = ({ 
  width = 129, 
  height = 61,
  style
}) => {
  const themeColors = useThemeColor();

  return (
    <Svg width={width} height={height} style={style} viewBox="0 0 128.69 61.07">
      {/* Cuerpo principal de la moto */}
      <Path 
        d="M91.4,19.22l-.29-1.69A16.69,16.69,0,0,0,67.7,5.25l-14,6.43v7.54H39.58l2.63,2.36A2.8,2.8,0,0,1,42.8,25L41.16,28a1.93,1.93,0,0,0,1.76,2.84h.74a1.74,1.74,0,0,1,1.54,2.66,6.07,6.07,0,0,1-5.31,3.07l.44,4,5.78,3.86a7.57,7.57,0,0,1,5.07,1.93l3.22,2.88H77.9l5.26-7.91-2.91-2.64a2.14,2.14,0,0,1,.11-3.27s3.48-4.08,4.91-5.85C93,27.46,91.4,19.22,91.4,19.22Z"
        fill={themeColors.green3to4}
      />

      {/* Rueda trasera exterior */}
      <Path 
        d="M20.18,20.71A20.18,20.18,0,1,0,40.36,40.89,20.18,20.18,0,0,0,20.18,20.71Zm0,31.55A11.37,11.37,0,1,1,31.55,40.89,11.37,11.37,0,0,1,20.18,52.26Z"
        fill={themeColors.green4to5}
      />

      {/* Rueda delantera exterior */}
      <Path 
        d="M108.51,20.71a20.18,20.18,0,1,0,20.18,20.18A20.18,20.18,0,0,0,108.51,20.71Zm0,31.55a11.37,11.37,0,1,1,11.37-11.37A11.37,11.37,0,0,1,108.51,52.26Z"
        fill={themeColors.green4to5}
      />

      {/* Orquilla delantera */}
      <Rect 
        x="96.07" 
        y="4.16" 
        width="3.9" 
        height="40.08" 
        transform="translate(1.03 52.25) rotate(-30)"
        fill={themeColors.green1to2}
      />

      {/* Tubo de escape */}
      <Path 
        d="M75,51H57.44a10.41,10.41,0,0,1-6.18-2.11L43.49,43a5.28,5.28,0,0,0-3.13-1.05h-21V39h21A8.25,8.25,0,0,1,45.3,40.6l7.77,5.89A7.41,7.41,0,0,0,57.46,48H75a4.71,4.71,0,0,0,3.89-2.07l4.84-7.16A1.31,1.31,0,0,0,83.5,37l-2.69-2.28,1.94-2.29,2.7,2.29a4.3,4.3,0,0,1,.78,5.69l-4.85,7.16A7.68,7.68,0,0,1,75,51Z"
        fill={themeColors.green1to2}
        />

      {/* Foco */}
      <Path 
        d="M99.72,12.72L93.54,9.6V3.49l6.18-3.12Z"
        fill={themeColors.green3to4}
        />

        {/* Orquilla trasera */}
      <Rect 
        x="31.21" 
        y="10.13" 
        width="3.9" 
        height="37.1" 
        transform="translate(29.99 -15.05) rotate(45)"
        fill={themeColors.green1to2}
      />

      {/* Panel de la moto */}
      <Path 
        d="M86.15,1.5h8.45a.92.92,0,0,1,.92.92V4.19a3.11,3.11,0,0,1-3.11,3.11H86.16a.92.92,0,0,1-.92-.92v-4a.92.92,0,0,1,.92-.92Z"
        transform="translate(5.52 35.81) rotate(-23.1)"
        fill={themeColors.green1to2}
      />

      {/* Asiento */}
      <Path 
        d="M12,9.24H29.85v2.9H53.7v7.13H27.39l-15.9-8A1.09,1.09,0,0,1,12,9.24Z"
        fill={themeColors.green1to2}
      />

      {/* Luz del foco */}
      <Path 
        d="M99.83.33h1.94a.74.74,0,0,1,.74.74V11.85a.74.74,0,0,1-.74.74H99.83Z"
        fill={themeColors.green1to2}
      />

      {/* Manillar */}
      <Path 
        d="M95.42,8.9l-11.73,5a1.62,1.62,0,0,1-2.12-.85h0a1.62,1.62,0,0,1,.85-2.11l11.73-5a1.6,1.6,0,0,1,2.11.84h0A1.62,1.62,0,0,1,95.42,8.9Z"
        fill={themeColors.green4to5}
      />

      {/* Motor 1 */}
      <Path 
        d="M77.22,35.17A7.21,7.21,0,0,0,70,28.85H61.83a7.14,7.14,0,1,0,.11,14.27h8.19a7.15,7.15,0,0,0,7.09-7.95Zm-7.17,6.41a5.66,5.66,0,1,1,5.65-5.66A5.66,5.66,0,0,1,70.05,41.58Z"
        fill={themeColors.green1to2}
        />

        {/* Motor 2 */}
      <Circle cx="70.08" cy="35.87" r="3.45" fill={themeColors.green1to2} />

      {/* Ruedas interiores */}
      <Path d="M114.32,41a5.91,5.91,0,1,1-5.91-5.91A5.92,5.92,0,0,1,114.32,41Z" fill={themeColors.green1to2} />
      <Path d="M26.06,41a5.91,5.91,0,1,1-5.9-5.91A5.91,5.91,0,0,1,26.06,41Z" fill={themeColors.green1to2} />
    </Svg>
  );
};