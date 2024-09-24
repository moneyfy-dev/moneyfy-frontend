interface EnvVars {
  apiUrl: string;
}

const ENV: { [key: string]: EnvVars } = {
  dev: {
    apiUrl: 'https://dev-backend.cl/app',
  },
  staging: {
    apiUrl: 'https://staging-backend.cl/app',
  },
  prod: {
    apiUrl: 'https://backend.cl/app',
  }
};

const getEnvVars = (env = process.env.NODE_ENV || 'development'): EnvVars => {
  if (env === 'development') {
    return ENV.dev;
  } else if (env === 'staging') {
    return ENV.staging;
  } else if (env === 'production') {
    return ENV.prod;
  }
  return ENV.dev;
};

export default getEnvVars;