import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LogoBci } from '../images/LogoBci';
import { LogoFDI } from '../images/LogoFDI';
import { ThemedText } from './ThemedText';

interface InsurerLogoProps {
    insurerName?: string;
    insurerAlias?: string;
    width?: number;
    height?: number;
}

const normalizeInsurerKey = (value?: string) =>
    (value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

const getLocalLogoKey = (insurerName?: string, insurerAlias?: string) => {
    const values = [
        normalizeInsurerKey(insurerName),
        normalizeInsurerKey(insurerAlias),
    ];

    if (values.some(value => value.includes('bci') || value === 'aseguradora4')) {
        return 'bci';
    }

    if (values.some(value => value.includes('fdi') || value === 'aseguradora5')) {
        return 'fdi';
    }

    return null;
};

export const InsurerLogo: React.FC<InsurerLogoProps> = ({
    insurerName,
    insurerAlias,
    width = 120,
    height = 60,
}) => {
    const logoKey = getLocalLogoKey(insurerName, insurerAlias);

    return (
        <View style={[styles.container, { width, height }]}>
            {logoKey === 'bci' && <LogoBci width={width} height={height} />}
            {logoKey === 'fdi' && <LogoFDI width={width} height={height} />}
            {!logoKey && !!insurerName && (
                <ThemedText variant="paragraphBold" textAlign="center">
                    {insurerName}
                </ThemedText>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
