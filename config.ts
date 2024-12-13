interface EnvVars {
  apiUrl: string;
  environment: string;
}

const ENV: { [key: string]: EnvVars } = {
  development: {
    apiUrl: process.env.API_URL || 'https://app-moneyfy-qa.connect360.cl/segurosref',
    environment: process.env.NODE_ENV || 'development'
  },
  production: {
    apiUrl: process.env.API_URL || 'https://app-moneyfy-qa.connect360.cl/segurosref',
    environment: process.env.NODE_ENV || 'production'
  }
};

const getEnvVars = (): EnvVars => {
  const env = process.env.NODE_ENV || 'development';
  
  return ENV[env];
};

export default getEnvVars;