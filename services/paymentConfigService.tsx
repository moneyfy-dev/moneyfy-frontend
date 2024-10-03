import axios from 'axios';
import getEnvVars from '../config';

const { apiUrl } = getEnvVars();

export interface Account {
  id: string;
  rut: string;
  name: string;
  alias: string;
  email: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
}

export const getAccounts = async (): Promise<Account[]> => {
  try {
    const response = await axios.get(`${apiUrl}/app/user/accounts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
};

export const addAccount = async (account: Omit<Account, 'id'>): Promise<Account> => {
  try {
    const response = await axios.post(`${apiUrl}/app/user/accounts`, account);
    return response.data;
  } catch (error) {
    console.error('Error adding account:', error);
    throw error;
  }
};