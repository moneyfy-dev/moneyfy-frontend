import { View, StyleSheet } from 'react-native';
import { LottieAnimation } from '@/shared/components/LottieAnimation';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { ThemeProvider } from '@/core/context/ThemeContext';

export default function SplashScreenMoneyfy() {
    const colorScheme = useColorScheme();
    
    return (
        <ThemeProvider>
            <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <SplashContent />
            </NavigationThemeProvider>
        </ThemeProvider>
    );
}

function SplashContent() {
    const themeColors = useThemeColor();
    
    return (
        <View style={[styles.splashContainer, { backgroundColor: themeColors.backgroundColor }]}>
            <LottieAnimation
                name="Logo"
                style={styles.splashAnimation}
                autoPlay
                loop={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    splashContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    splashAnimation: {
        width: 320,
        height: 320,
    },
});