import { Asset } from 'expo-asset';

export const animations = {
  NoAccountWarning: require('./NoAccountWarning.json'),
  Loading: require('./NoAccountWarning.json'),
  Success: require('./NoAccountWarning.json'),
  Onboarding1: require('./Onboarding1.json'),
  Onboarding2: require('./Onboarding2.json'),
  Onboarding3: require('./Onboarding3.json'),
  Logo: require('./Logo.json'),
  // ... otras animaciones
};

// Opcional: Precarga de animaciones
export const preloadAnimations = async () => {
  const animationAssets = Object.values(animations).map(animation => Asset.fromModule(animation));
  await Promise.all(animationAssets.map(asset => asset.downloadAsync()));
}; 