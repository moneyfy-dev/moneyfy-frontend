import React, { useRef, useEffect } from 'react';
import { Animated, PanResponder, Dimensions, ViewStyle, StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '../hooks/useThemeColor';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DRAG_THRESHOLD = 200; // Pixels necesarios para activar el cierre
const SNAP_TOP = 0;
const SNAP_BOTTOM = SCREEN_HEIGHT;

interface AnimatedCardProps {
    isVisible: boolean;
    hideCard: () => void;
    children: React.ReactNode;
    style?: ViewStyle;
    openPercentage?: number; // Porcentaje de apertura de la pantalla
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
    isVisible, 
    hideCard, 
    children, 
    style, 
    openPercentage = 75
}) => {
    const themeColors = useThemeColor();
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const openPosition = (SCREEN_HEIGHT * (100 - openPercentage)) / 100;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            onPanResponderMove: (_, { dy }) => {
                translateY.setValue(openPosition + dy);
            },

            onPanResponderRelease: (_, { vy }) => {
                const shouldClose = vy > 0.2;
                
                Animated.spring(translateY, {
                    toValue: shouldClose ? SNAP_BOTTOM : openPosition,
                    useNativeDriver: true,
                    tension: 45,
                    friction: 10,
                    velocity: vy
                }).start(() => {
                    if (shouldClose) hideCard();
                });
            }
        })
    ).current;

    useEffect(() => {
        if (isVisible) {
            Animated.spring(translateY, {
                toValue: openPosition,
                useNativeDriver: true,
                tension: 50,
                friction: 12
            }).start();
        } else {
            translateY.setValue(SNAP_BOTTOM);
        }
    }, [isVisible]);

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: -SCREEN_HEIGHT,
                    height: SCREEN_HEIGHT,
                    transform: [{ translateY }]
                },
                style
            ]}
            {...panResponder.panHandlers}
        >
            <ThemedView style={[styles.card, { backgroundColor: themeColors.backgroundCardColor }]}>
                <ThemedView style={[styles.bar, { backgroundColor: themeColors.extremeContrastGray }]}/>
                {children}
            </ThemedView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 40,
        paddingHorizontal: 24,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        alignItems: 'center',
    },
    bar: {
        width: 60,
        height: 8,
        borderRadius: 4,
        marginBottom: 20,
    },
});