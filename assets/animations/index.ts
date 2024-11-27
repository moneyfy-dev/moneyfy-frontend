import { Asset } from 'expo-asset';

export const animations = {
  noAccountWarning: require('./NoAccountWarning.json'),
  loading: require('./NoAccountWarning.json'),
  success: require('./NoAccountWarning.json'),
  onboarding1: require('./Onboarding1.json'),
  onboarding2: require('./Onboarding2.json'),
  onboarding3: require('./Onboarding3.json'),
  // ... otras animaciones
};

// Opcional: Precarga de animaciones
export const preloadAnimations = async () => {
  const animationAssets = Object.values(animations).map(animation => Asset.fromModule(animation));
  await Promise.all(animationAssets.map(asset => asset.downloadAsync()));
}; 