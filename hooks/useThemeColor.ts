import { useTheme } from '../context/ThemeContext';
import Colors from '../constants/Colors';

export function useThemeColor() {
  const { currentTheme } = useTheme();

  const getThemeColors = () => {
    return {
      backgroundColor: currentTheme === 'dark' ? Colors.common.black : Colors.common.white,
      backgroundCardColor: currentTheme === 'dark' ? Colors.common.gray0 : Colors.common.white,
      buttonBackgroundColor: currentTheme === 'dark' ? Colors.common.green2 : Colors.common.green2,
      buttonTextColor: Colors.common.white,
      inputBackground: Colors.common.transparent,
      borderBackgroundColor: currentTheme === 'dark' ? Colors.common.gray1 : Colors.common.gray6,
      textColor: currentTheme === 'dark' ? Colors.common.white : Colors.common.black,
      textParagraph: currentTheme === 'dark' ? Colors.common.gray3 : Colors.common.gray1,
      textColorAccent: currentTheme === 'dark' ? Colors.common.green1 : Colors.common.green2,
      accentInDarkMode: currentTheme === 'dark' ? Colors.common.green1 : Colors.common.black,
      inputColor: currentTheme === 'dark' ? Colors.common.white : Colors.common.black,
      disabledColor: currentTheme === 'dark' ? Colors.common.gray1 : Colors.common.gray5,
      focusedBorderColor: currentTheme === 'dark' ? Colors.common.green1 : Colors.common.green2,
      unfocusedBorderColor: Colors.common.gray4,
      placeholderColor: Colors.common.gray3,

      green1to2: currentTheme === 'dark' ? Colors.common.green1 : Colors.common.green2,
      green2to3: currentTheme === 'dark' ? Colors.common.green2 : Colors.common.green3,
      green3to4: currentTheme === 'dark' ? Colors.common.green3 : Colors.common.green4,
      green4to5: currentTheme === 'dark' ? Colors.common.green4 : Colors.common.green5,

      white: Colors.common.white,
      extremeContrastGray: currentTheme === 'dark' ? Colors.common.gray0 : Colors.common.gray6,
      gray1Gray04: currentTheme === 'dark' ? Colors.common.gray1 : Colors.common.gray4,
      iconRefBorder: currentTheme === 'dark' ? Colors.common.gray0 : Colors.common.black,
      iconRefGray: currentTheme === 'dark' ? Colors.common.gray0 : Colors.common.gray1,
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