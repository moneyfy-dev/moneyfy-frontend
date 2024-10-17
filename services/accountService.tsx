import axios from 'axios';
import getEnvVars from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account } from '@/types/useAccounts';

const { apiUrl } = getEnvVars();

export const addAccount = async (accountData: Omit<Account, 'accountId' | 'selected' | 'createdDate' | 'updatedDate'>): Promise<Account[]> => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.post(`${apiUrl}/accounts/create`, accountData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.user.accounts;
};

export const selectAccount = async (accountId: string): Promise<Account[]> => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.post(`${apiUrl}/accounts/select/${accountId}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.user.accounts;
};
