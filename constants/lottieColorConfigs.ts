import { useThemeColor } from '@/shared/hooks/useThemeColor';
import Colors from '../constants/Colors';

export const getLottieColorFilters = (themeColors: ReturnType<typeof useThemeColor>) => ({
    Onboarding1: [
        {
            keypath: "billetera contornos.Grupo 1",
            color: Colors.common.black,
        },
        {
            keypath: "billetera contornos.Grupo 2",
            color: Colors.common.green2,
        },
        {
            keypath: "billetera contornos.Grupo 3",
            color: Colors.common.green1,
        },
        {
            keypath: "tarjeta contornos.Grupo 1",
            color: Colors.status.warning,
        },
        {
            keypath: "tarjeta contornos.Grupo 2",
            color: Colors.status.warning,
        },
        {
            keypath: "tarjeta contornos.Grupo 3",
            color: Colors.status.error,
        },
        {
            keypath: "tarjeta contornos.Grupo 4",
            color: Colors.common.white,
        },
        {
            keypath: "tarjeta contornos.Grupo 5",
            color: Colors.common.white,
        },
        {
            keypath: "tarjeta contornos.Grupo 6",
            color: Colors.common.white,
        },
        {
            keypath: "tarjeta contornos.Grupo 7",
            color: Colors.common.white,
        },
        {
            keypath: "tarjeta contornos.Grupo 8",
            color: Colors.common.white,
        },
        {
            keypath: "tarjeta contornos.Grupo 9",
            color: Colors.common.white,
        },
        {
            keypath: "tarjeta contornos.Grupo 10",
            color: Colors.common.white,
        },
        {
            keypath: "tarjeta contornos.Grupo 11",
            color: Colors.common.white,
        },
        {
            keypath: "tarjeta contornos.Grupo 12",
            color: Colors.common.white,
        },
        {
            keypath: "tarjeta contornos.Grupo 13",
            color: themeColors.onboardingBackground,
        },
        {
            keypath: "billete-3 contornos.Grupo 1",
            color: Colors.common.white,
        },
        {
            keypath: "billete-3 contornos.Grupo 2",
            color: Colors.common.white,
        },
        {
            keypath: "billete-3 contornos.Grupo 3",
            color: Colors.common.white,
        },
        {
            keypath: "billete-3 contornos.Grupo 4",
            color: Colors.common.white,
        },
        {
            keypath: "billete-3 contornos.Grupo 5",
            color: Colors.common.green3,
        },
        {
            keypath: "billete-2 contornos.Grupo 1",
            color: Colors.common.white,
        },
        {
            keypath: "billete-2 contornos.Grupo 2",
            color: Colors.common.white,
        },
        {
            keypath: "billete-2 contornos.Grupo 3",
            color: Colors.common.white,
        },
        {
            keypath: "billete-2 contornos.Grupo 4",
            color: Colors.common.white,
        },
        {
            keypath: "billete-2 contornos.Grupo 5",
            color: Colors.common.green2,
        },
        {
            keypath: "billete-1 contornos.Grupo 1",
            color: Colors.common.white,
        },
        {
            keypath: "billete-1 contornos.Grupo 2",
            color: Colors.common.white,
        },
        {
            keypath: "billete-1 contornos.Grupo 3",
            color: Colors.common.white,
        },
        {
            keypath: "billete-1 contornos.Grupo 4",
            color: Colors.common.white,
        },
        {
            keypath: "billete-1 contornos.Grupo 5",
            color: Colors.common.green1,
        },
        {
            keypath: "bg contornos 1.Grupo 3",
            color: themeColors.extremeContrastGray,
        },
        {
            keypath: "bg contornos 1.Grupo 2",
            color: themeColors.onboardingBackground,
        },
    ],
    Onboarding2: [
        {
            keypath: "cabeza contornos 2.Grupo 1",
            color: themeColors.iconRefBorder,
        },
        {
            keypath: "cabeza contornos 2.Grupo 2",
            color: Colors.special.skinIcons,
        },
        {
            keypath: "brazo-der contornos.Grupo 1",
            color: themeColors.gray2to3,
        },
        {
            keypath: "brazo-der contornos.Grupo 2",
            color: Colors.special.skinIcons,
        },
        {
            keypath: "tronco contornos.Grupo 1",
            color: Colors.special.skinIcons,
        },
        {
            keypath: "tronco contornos.Grupo 2",
            color: themeColors.gray2to3,
        },
        {
            keypath: "brazo-izq contornos.Grupo 1",
            color: themeColors.gray2to3,
        },
        {
            keypath: "brazo-izq contornos.Grupo 2",
            color: Colors.special.skinIcons,
        },
        {
            keypath: "pierna-der contornos.Grupo 1",
            color: Colors.common.green1,
        },
        {
            keypath: "pierna-der contornos.Grupo 2",
            color: Colors.common.black,
        },
        {
            keypath: "pierna-izq contornos.Grupo 1",
            color: Colors.common.green2,
        },
        {
            keypath: "pierna-izq contornos.Grupo 2",
            color: Colors.common.black,
        },
        {
            keypath: "bloques contornos.Grupo 1",
            color: themeColors.onboardingBackground,
        },
        {
            keypath: "bloques contornos.Grupo 2",
            color: Colors.status.error,
        },
        {
            keypath: "bloques contornos.Grupo 3",
            color: Colors.common.green1,
        },
        {
            keypath: "bloques contornos.Grupo 4",
            color: Colors.common.green2,
        },
        {
            keypath: "bg contornos 2.Grupo 1",
            color: Colors.common.green2,
        },
        {
            keypath: "bg contornos 2.Grupo 2",
            color: themeColors.onboardingBackground,
        },
        {
            keypath: "bg contornos 2.Grupo 3",
            color: themeColors.extremeContrastGray,
        },
    ],
    Onboarding3: [
        {
            keypath: "brazo-der contornos.Grupo 1",
            color: themeColors.gray2to3,
        },
        {
            keypath: "brazo-der contornos.Grupo 2",
            color: Colors.special.skinIcons,
        },
        {
            keypath: "qr contornos.Grupo 1",
            color: Colors.common.black,
        },
        {
            keypath: "qr contornos.Grupo 2",
            color: Colors.common.white,
        },
        {
            keypath: "brazo-izq contornos.Grupo 1",
            color: themeColors.gray2to3,
        },
        {
            keypath: "brazo-izq contornos.Grupo 2",
            color: Colors.special.skinIcons,
        },
        {
            keypath: "tronco contornos.Grupo 1",
            color: Colors.special.skinIcons,
        },
        {
            keypath: "tronco contornos.Grupo 2",
            color: themeColors.gray2to3,
        },
        {
            keypath: "pierna-der contornos.Grupo 1",
            color: Colors.common.green1,
        },
        {
            keypath: "pierna-der contornos.Grupo 2",
            color: Colors.common.black,
        },
        {
            keypath: "pierna-izq contornos.Grupo 1",
            color: Colors.common.green2,
        },
        {
            keypath: "pierna-izq contornos.Grupo 2",
            color: Colors.common.black,
        },
        {
            keypath: "cabeza contornos 3.Grupo 1",
            color: Colors.common.black,
        },
        {
            keypath: "cabeza contornos 3.Grupo 2",
            color: Colors.special.skinIcons,
        },
        {
            keypath: "cabeza contornos 3.Grupo 3",
            color: Colors.common.black,
        },
        {
            keypath: "bg contornos 3.Grupo 1",
            color: themeColors.onboardingBackground,
        },
        {
            keypath: "bg contornos 3.Grupo 2",
            color: Colors.common.green3,
        },
        {
            keypath: "bg contornos 3.Grupo 3",
            color: themeColors.extremeContrastGray,
        },
    ],
    NoAccountWarning: [
        {
            keypath: "brazo-izq contornos.Grupo 1",
            color: themeColors.gray2to3,
        },
        {
            keypath: "brazo-izq contornos.Grupo 2",
            color: Colors.special.skinIcons,
        },
        {
            keypath: "tarjeta contornos.Grupo 1",
            color: Colors.common.white,
        },
        {
            keypath: "tarjeta contornos.Grupo 2",
            color: Colors.common.white,
        },
        {
            keypath: "tarjeta contornos.Grupo 3",
            color: Colors.common.white,
        },
        {
            keypath: "tarjeta contornos.Grupo 4",
            color: Colors.common.white,
        },
        {
            keypath: "tarjeta contornos.Grupo 5",
            color: Colors.common.white,
        },
        {
            keypath: "tarjeta contornos.Grupo 6",
            color: Colors.common.white,
        },
        {
            keypath: "tarjeta contornos.Grupo 7",
            color: Colors.common.white,
        },
        {
            keypath: "tarjeta contornos.Grupo 8",
            color: Colors.common.white,
        },
        {
            keypath: "tarjeta contornos.Grupo 9",
            color: Colors.common.white,
        },
        {
            keypath: "tarjeta contornos.Grupo 10",
            color: Colors.common.white,
        },
        {
            keypath: "tarjeta contornos.Grupo 11",
            color: Colors.common.white,
        },
        {
            keypath: "tarjeta contornos.Grupo 12",
            color: Colors.special.skinIcons,
        },
        {
            keypath: "tarjeta contornos.Grupo 13",
            color: Colors.status.warning,
        },
        {
            keypath: "tarjeta contornos.Grupo 14",
            color: Colors.status.warning,
        },
        {
            keypath: "tarjeta contornos.Grupo 15",
            color: Colors.status.error,
        },
        {
            keypath: "billete-1 contornos.Grupo 1",
            color: Colors.common.white,
        },
        {
            keypath: "billete-1 contornos.Grupo 2",
            color: Colors.common.white,
        },
        {
            keypath: "billete-1 contornos.Grupo 3",
            color: Colors.common.white,
        },
        {
            keypath: "billete-1 contornos.Grupo 4",
            color: Colors.common.white,
        },
        {
            keypath: "billete-1 contornos.Grupo 5",
            color: Colors.common.green3,
        },
        {
            keypath: "billete-2 contornos.Grupo 1",
            color: Colors.common.white,
        },
        {
            keypath: "billete-2 contornos.Grupo 2",
            color: Colors.common.white,
        },
        {
            keypath: "billete-2 contornos.Grupo 3",
            color: Colors.common.white,
        },
        {
            keypath: "billete-2 contornos.Grupo 4",
            color: Colors.common.white,
        },
        {
            keypath: "billete-2 contornos.Grupo 5",
            color: Colors.common.green2,
        },
        {
            keypath: "cuello",
            color: Colors.special.skinIcons,
        },
        {
            keypath: "tronco",
            color: themeColors.gray2to3,
        },
        {
            keypath: "pierna-der contornos.Grupo 1",
            color: Colors.common.green1,
        },
        {
            keypath: "pierna-der contornos.Grupo 2",
            color: Colors.common.black,
        },
        {
            keypath: "pierna-izq contornos.Grupo 1",
            color: Colors.common.green2,
        },
        {
            keypath: "pierna-izq contornos.Grupo 2",
            color: Colors.common.black,
        },
        {
            keypath: "cabeza contornos 3.Grupo 1",
            color: Colors.common.black,
        },
        {
            keypath: "cabeza contornos 3.Grupo 2",
            color: Colors.special.skinIcons,
        },
        {
            keypath: "cabeza contornos 3.Grupo 3",
            color: Colors.common.black,
        },
        {
            keypath: "bg contornos.Grupo 1",
            color: themeColors.iconRefBorder,
        },
        {
            keypath: "bg contornos.Grupo 2",
            color: Colors.common.green2,
        },
        {
            keypath: "bg contornos.Grupo 3",
            color: Colors.common.green3,
        },
        {
            keypath: "bg contornos.Grupo 4",
            color: Colors.common.green4,
        },
        {
            keypath: "bg contornos.Grupo 5",
            color: themeColors.extremeContrastGray,
        },
    ],
    Loading: [
        {
            keypath: "Loading.nube 1",
            color: Colors.common.gray6,
        },
        {
            keypath: "Loading.paperplane.Group 1",
            color: Colors.common.green3,
        },
        {
            keypath: "Loading.paperplane.Group 2",
            color: Colors.common.green2,
        },
        {
            keypath: "Loading.paperplane.Group 3",
            color: Colors.common.green1,
        },
        {
            keypath: "Loading.nube 2",
            color: Colors.common.gray6,
        },
    ],
    Logo: [
        {
            keypath: "f1 contornos 2",
            color: themeColors.textColorAccent,
        },
        {
            keypath: "f2 contornos 2",
            color: themeColors.textColorAccent,
        },
        {
            keypath: "f3 contornos 2",
            color: themeColors.textColorAccent,
        },
        {
            keypath: "y1 contornos 2",
            color: themeColors.textColorAccent,
        },
        {
            keypath: "y2 contornos 2",
            color: themeColors.textColorAccent,
        },
        {
            keypath: "M contornos",
            color: themeColors.textColor,
        },
        {
            keypath: "O contornos",
            color: themeColors.textColor,
        },
        {
            keypath: "N contornos",
            color: themeColors.textColor,
        },
        {
            keypath: "E contornos",
            color: themeColors.textColor,
        },
        {
            keypath: "Y contornos",
            color: themeColors.textColor,
        },
        {
            keypath: "Capa de formas 1",
            color: themeColors.textColorAccent,
        },
        {
            keypath: "Capa de formas 2",
            color: themeColors.textColorAccent,
        },
        {
            keypath: "Capa de formas 3",
            color: themeColors.textColorAccent,
        },
    ],
});

const colorFilters = [


];