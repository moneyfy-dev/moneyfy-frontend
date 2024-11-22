import { Asset } from 'expo-asset';

export const animations = {
  noAccountWarning: require('./NoAccountWarning.json'),
  loading: require('./NoAccountWarning.json'),
  success: require('./NoAccountWarning.json'),
  // ... otras animaciones
};

// Opcional: Precarga de animaciones
export const preloadAnimations = async () => {
  const animationAssets = Object.values(animations).map(animation => Asset.fromModule(animation));
  await Promise.all(animationAssets.map(asset => asset.downloadAsync()));
}; 