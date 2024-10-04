import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEnvVars from '../config';

export interface UserData {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  profilePicture: string;
  // Añade aquí cualquier otro campo que venga en la respuesta JSON
}

export const fetchInitialUserData = async (token: string): Promise<UserData> => {
  try {
    const response = await axios.get(`${getEnvVars}/app/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching initial user data:', error);
    throw error;
  }
};

export const saveUserDataLocally = async (userData: UserData): Promise<void> => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data locally:', error);
    throw error;
  }
};

export const getUserDataFromStorage = async (): Promise<UserData | null> => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data from storage:', error);
    return null;
  }
};

export const updateUserData = async (updatedData: Partial<UserData>, token: string): Promise<UserData> => {
  try {
    const response = await axios.put(`${getEnvVars}/app/users`, updatedData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    const newUserData = { ...await getUserDataFromStorage(), ...response.data };
    await saveUserDataLocally(newUserData);
    return newUserData;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};