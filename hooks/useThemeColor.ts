import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';

export function useThemeColor() {
  const colorScheme = useColorScheme();

  const getThemeColors = () => {
    return {
      backgroundColor: colorScheme === 'dark' ? Colors.common.black : Colors.common.white,
      backgroundCardColor: colorScheme === 'dark' ? Colors.common.gray0 : Colors.common.white,
      buttonBackgroundColor: colorScheme === 'dark' ? Colors.common.green1 : Colors.common.green2,
      buttonTextColor: Colors.common.white,
      inputBackground: Colors.common.transparent,
      borderBackgroundColor: colorScheme === 'dark' ? Colors.common.gray1 : Colors.common.gray6,
      textColor: colorScheme === 'dark' ? Colors.common.white : Colors.common.black,
      textParagraph: colorScheme === 'dark' ? Colors.common.gray3 : Colors.common.gray1,
      textColorAccent: colorScheme === 'dark' ? Colors.common.green1 : Colors.common.green2,
      accentInDarkMode: colorScheme === 'dark' ? Colors.common.green1 : Colors.common.black,
      inputColor: colorScheme === 'dark' ? Colors.common.white : Colors.common.black,
      disabledColor: colorScheme === 'dark' ? Colors.common.gray1 : Colors.common.gray5,
      focusedBorderColor: colorScheme === 'dark' ? Colors.common.green1 : Colors.common.green2,
      unfocusedBorderColor: Colors.common.gray4,
      placeholderColor: Colors.common.gray3,

      white: Colors.common.white,
      extremeContrastGray: colorScheme === 'dark' ? Colors.common.gray0 : Colors.common.gray6,
      gray1Gray04: colorScheme === 'dark' ? Colors.common.gray1 : Colors.common.gray4,
      iconRefBorder: colorScheme === 'dark' ? Colors.common.gray0 : Colors.common.black,
      iconRefGray: colorScheme === 'dark' ? Colors.common.gray0 : Colors.common.gray1,
      status: {
        success: Colors.status.success,
        error: Colors.status.error,
        warning: Colors.status.warning,
        info: Colors.status.info,
      }
    };
  };

  return getThemeColors();
}