import Constants from 'expo-constants';

interface EnvVars {
  apiUrl: string;
  environment: string;
}

const ENV: { [key: string]: EnvVars } = {
  development: {
    apiUrl: Constants.expoConfig?.extra?.apiUrl || 'https://app-moneyfy-qa.connect360.cl/segurosref',
    environment: Constants.expoConfig?.extra?.nodeEnv || 'development'
  },
  production: {
    apiUrl: Constants.expoConfig?.extra?.apiUrl || 'https://app-moneyfy-qa.connect360.cl/segurosref',
    environment: Constants.expoConfig?.extra?.nodeEnv || 'production'
  }
};

const getEnvVars = (): EnvVars => {
  const env = Constants.expoConfig?.extra?.nodeEnv || 'development';
  return ENV[env];
};

export default getEnvVars;