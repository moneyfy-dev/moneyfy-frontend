import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, FlatList, Animated } from 'react-native';
import { useOnboarding } from '@/context/OnboardingContext';
import { ThemedText } from './ThemedText';
import { ThemedButton } from './ThemedButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LottieAnimation } from './LottieAnimation';
import { animations } from '@/assets/animations';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    animation: 'Onboarding1',
    title: 'Gestiona tus comisiones fácilmente',
    description: 'Monitorea tus comisiones y saldo en tiempo real desde tu billetera virtual. Retira tus ganancias o úsalas para futuros pagos sin complicaciones.'
  },
  {
    id: '2',
    animation: 'Onboarding2',
    title: 'Cotiza seguros de forma rápida',
    description: 'Cotiza diferentes planes de seguros ingresando la información de tu vehículo. Obtén estimaciones y comparte enlaces o códigos QR para facilitar el proceso de pago.'
  },
  {
    id: '3',
    animation: 'Onboarding3',
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
      Animated.spring(dotWidths[index], {
        toValue: index === activeSlide ? 24 : 8,
        useNativeDriver: false,
        tension: 50,
        friction: 7
      }).start();
    });
  }, [activeSlide]);

  const handleNext = () => {
    if (activeSlide === slides.length - 1) {
      handleFinish();
    } else {
      const nextSlide = activeSlide + 1;
      flatListRef.current?.scrollToIndex({
        index: nextSlide,
        animated: true
      });
      setActiveSlide(nextSlide);
    }
  };

  const renderDots = () => (
    <View style={styles.pagination}>
      {slides.map((_, index) => {
        const isActive = index === activeSlide;
        
        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: dotWidths[index],
                backgroundColor: isActive 
                  ? themeColors.textColorAccent 
                  : themeColors.disabledColor
              }
            ]}
          />
        );
      })}
    </View>
  );

  const renderItem = ({ item }: { item: typeof slides[0] }) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <LottieAnimation 
          name={item.animation as keyof typeof animations}
          style={styles.image}
          autoPlay
          loop
        />
      </View>
      {renderDots()}
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

  const handleFinish = async () => {
    try {
      await setHasSeenOnboarding(true);
      setShouldShowOnboarding(false);
    } catch (error) {
      console.error('Error finishing onboarding:', error);
    }
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
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveSlide(newIndex);
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
    width: 340,
    height: 340,
    marginVertical: 72,
  },
  textContainer: {
    marginVertical: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
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