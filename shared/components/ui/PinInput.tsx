import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '../../hooks/useThemeColor';

interface PinInputProps {
    value: string;
    maxLength?: number;
    onNumberPress: (number: string) => void;
    onDelete: () => void;
}

export const PinInput = ({ 
    value, 
    maxLength = 4, 
    onNumberPress, 
    onDelete 
}: PinInputProps) => {
    const themeColors = useThemeColor();

    const renderPinDots = () => (
        <View style={styles.pinContainer}>
            {[...Array(maxLength)].map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.pinDot,
                        { 
                            borderColor: index < value.length 
                                ? themeColors.textColorAccent 
                                : themeColors.unfocusedBorderColor 
                        }
                    ]}
                />
            ))}
        </View>
    );

    const renderNumberPad = () => {
        const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'];
        return (
            <View style={styles.numberPad}>
                {numbers.map((number, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.numberButton}
                        onPress={() => number === 'delete' ? onDelete() : onNumberPress(number)}
                        disabled={number === ''}
                    >
                        {number === 'delete' ? (
                            <Ionicons 
                                name="backspace-outline" 
                                size={24} 
                                color={themeColors.textColorAccent} 
                            />
                        ) : (
                            <ThemedText variant="jumboTitle">{number}</ThemedText>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {renderPinDots()}
            {renderNumberPad()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
    },
    pinDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        marginHorizontal: 10,
    },
    numberPad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    numberButton: {
        width: '33%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
}); 