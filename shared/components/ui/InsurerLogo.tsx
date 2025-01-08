import React from 'react';
import { SvgXml } from 'react-native-svg';
import { useTheme } from '@/core/context';
import { View } from 'react-native';

interface InsurerLogoProps {
    darkLogo: string;
    lightLogo: string;
    width?: number;
    height?: number;
}

export const InsurerLogo: React.FC<InsurerLogoProps> = ({ 
    darkLogo, 
    lightLogo, 
    width = 200, 
    height = 100 
}) => {
    const { currentTheme } = useTheme();
    
    const unescapeSvg = (svg: string) => {
        try {
            return JSON.parse(`"${svg}"`);
        } catch {
            return svg;
        }
    };

    const convertStylesToInline = (svg: string) => {
        // Extraer los estilos
        const styleMatch = svg.match(/<style>([\s\S]*?)<\/style>/);
        if (!styleMatch) return svg;

        const styleContent = styleMatch[1];
        // Convertir las reglas CSS en un objeto
        const styleRules: { [key: string]: string } = {};
        styleContent.match(/\.([^{]+){([^}]+)}/g)?.forEach(rule => {
            const [className, styles] = rule.match(/\.([^{]+){([^}]+)}/)?.slice(1) || [];
            if (className) {
                styleRules[className] = styles.trim();
            }
        });

        // Reemplazar las clases con estilos inline
        let newSvg = svg;
        Object.keys(styleRules).forEach(className => {
            const classRegex = new RegExp(`class="([^"]*?)${className}([^"]*?)"`, 'g');
            newSvg = newSvg.replace(classRegex, (match, prefix, suffix) => {
                const styles = styleRules[className]
                    .split(';')
                    .filter(Boolean)
                    .map(style => style.trim())
                    .join(';');
                return `style="${styles}"`;
            });
        });

        // Eliminar la sección de estilos
        newSvg = newSvg.replace(/<style>[\s\S]*?<\/style>/, '');

        return newSvg;
    };

    const prepareSvg = (svg: string) => {
        const unescaped = unescapeSvg(svg);
        if (!unescaped.includes('<svg')) {
            return '';
        }

        return convertStylesToInline(unescaped);
    };

    const logoSvg = currentTheme === 'dark' ? darkLogo : lightLogo;
    const preparedSvg = prepareSvg(logoSvg);

    if (!preparedSvg) {
        return null;
    }

    return (
        <View style={{ width, height }}>
            <SvgXml 
                xml={preparedSvg}
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
            />
        </View>
    );
}; 