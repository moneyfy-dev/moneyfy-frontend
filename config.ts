interface EnvVars {
  apiUrl: string;
}

const ENV: { [key: string]: EnvVars } = {
  dev: {
    apiUrl: 'http://45.236.128.120:8080/segurosref',
  },
  prod: {
    apiUrl: 'http://45.236.128.120:8080/segurosref',
  }
};

const getEnvVars = (env = process.env.NODE_ENV || 'development'): EnvVars => {
  if (env === 'development') {
    return ENV.dev;
  } else if (env === 'production') {
    return ENV.prod;
  }
  return ENV.dev;
};

export default getEnvVars;