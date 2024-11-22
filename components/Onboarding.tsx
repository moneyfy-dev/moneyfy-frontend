import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity, Animated } from 'react-native';
import { useOnboarding } from '@/context/OnboardingContext';
import { ThemedText } from './ThemedText';
import { ThemedButton } from './ThemedButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Onboarding1Icon } from './images/onboarding/Onboarding1Icon';
import { Onboarding2Icon } from './images/onboarding/Onboarding2Icon';
import { Onboarding3Icon } from './images/onboarding/Onboarding3Icon';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: Onboarding1Icon,
    title: 'Gestiona tus comisiones fácilmente',
    description: 'Monitorea tus comisiones y saldo en tiempo real desde tu billetera virtual. Retira tus ganancias o úsalas para futuros pagos sin complicaciones.'
  },
  {
    id: '2',
    icon: Onboarding2Icon,
    title: 'Cotiza seguros de forma rápida',
    description: 'Cotiza diferentes planes de seguros ingresando la información de tu vehículo. Obtén estimaciones y comparte enlaces o códigos QR para facilitar el proceso de pago.'
  },
  {
    id: '3',
    icon: Onboarding3Icon,
    title: 'Gana con referidos',
    description: 'Comparte tu código de referido y gana comisiones. Sigue el rendimiento de tus referidos y maximiza tus ganancias con el programa de comisiones multinivel.'
  }
];

export const Onboarding = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const dotWidths = useRef(slides.map(() => new Animated.Value(8))).current;
  const { setHasSeenOnboarding, setShouldShowOnboarding } = useOnboarding();
  const themeColors = useThemeColor();

  useEffect(() => {
    slides.forEach((_, index) => {
      Animated.timing(dotWidths[index], {
        toValue: index === activeSlide ? 24 : 8,
        duration: 100,
        useNativeDriver: false,
      }).start();
    });
  }, [activeSlide]);

  const renderItem = ({ item }: { item: typeof slides[0] }) => {
    const Icon = item.icon;
    return (
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          <Icon style={styles.image} />
          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: dotWidths[index],
                    backgroundColor: index === activeSlide ? themeColors.textColorAccent : themeColors.disabledColor
                  }
                ]}
              />
            ))}
          </View>
        </View>
        <View style={styles.textContainer}>
          <ThemedText variant="superTitle" textAlign="center" marginBottom={16}>
            {item.title}
          </ThemedText>
          <ThemedText variant="paragraph" textAlign="center">
            {item.description}
          </ThemedText>
        </View>
      </View>
    );
  };

  const handleNext = () => {
    if (activeSlide === slides.length - 1) {
      handleFinish();
    } else {
      const nextSlide = activeSlide + 1;
      if (nextSlide < slides.length) {
        flatListRef.current?.scrollToIndex({
          index: nextSlide,
          animated: true
        });
        setActiveSlide(nextSlide);
      }
    }
  };

  const handleFinish = async () => {
    try {
      await setHasSeenOnboarding(true);
      setShouldShowOnboarding(false);
    } catch (error) {
      console.error('Error finishing onboarding:', error);
    }
  };

  const onScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({
        index: info.index,
        animated: true
      });
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.backgroundColor }]}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollToIndexFailed={onScrollToIndexFailed}
        onMomentumScrollEnd={(event) => {
          const slideIndex = Math.round(
            event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
          );
          setActiveSlide(slideIndex);
        }}
        keyExtractor={(item) => item.id}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      <View style={styles.buttonContainer}>
        <ThemedButton
          text={activeSlide === slides.length - 1 ? "Comenzar" : "Siguiente"}
          onPress={handleNext}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginVertical: 72,
  },
  textContainer: {
    marginVertical: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    marginVertical: 24,
  },
}); 