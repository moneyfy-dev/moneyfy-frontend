import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/core/types';
import { storage } from '../storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('storage.quote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('clears every persisted quote key', async () => {
    await storage.quote.clearQuote();

    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(
      Object.values(STORAGE_KEYS.QUOTE),
    );
  });
});
