import axios from 'axios';
import getEnvVars from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { apiUrl } = getEnvVars();

export const addAccount = async (accountData: {
  personalId: string;
  holderName: string;
  alias: string;
  email: string;
  bank: string;
  accountType: string;
  accountNumber: string;
}) => {
  const token = await AsyncStorage.getItem('token');
  const sessionToken = await AsyncStorage.getItem('sessionToken');
  const response = await axios.post(`${apiUrl}/accounts/create`, accountData, {
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
      'Refresh-Token': token
    },
  });
  return response.data;
};

export const selectAccount = async (accountId: string) => {
  const token = await AsyncStorage.getItem('token');
  const sessionToken = await AsyncStorage.getItem('sessionToken');
  const response = await axios.post(`${apiUrl}/accounts/select/${accountId}`, {}, {
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
      'Refresh-Token': token
    },
  });
  return response.data;
};

export const deleteAccount = async (accountId: string) => {
  const token = await AsyncStorage.getItem('token');
  const sessionToken = await AsyncStorage.getItem('sessionToken');
  const response = await axios.delete(`${apiUrl}/accounts/delete/${accountId}`, {
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
      'Refresh-Token': token
    },
  });
  return response.data;
};

export const updateAccount = async (accountId: string, accountData: any) => {
  const account = {
    accountId: accountId,
    personalId: accountData.personalId,
    holderName: accountData.holderName,
    alias: accountData.alias,
    email: accountData.email,
    bank: accountData.bank,
    accountType: accountData.accountType,
    accountNumber: accountData.accountNumber
  }
  const token = await AsyncStorage.getItem('token');
  const sessionToken = await AsyncStorage.getItem('sessionToken');
  const response = await axios.put(`${apiUrl}/accounts/update`, account, {
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
      'Refresh-Token': token
    },
  });
  return response.data;
};
