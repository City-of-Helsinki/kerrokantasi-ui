import path from 'path';

export const getCityConfig = (env) => {
  if (!env.REACT_APP_CITY_CONFIG || env.REACT_APP_CITY_CONFIG === 'cities/helsinki') {
    return path.resolve(__dirname, `../cities/helsinki/`);
  }
  if (env.REACT_APP_CITY_CONFIG === 'whitelabel') {
    return path.resolve(__dirname, `../src`);
  }

  return path.resolve(__dirname, `../node_modules/${env.REACT_APP_CITY_CONFIG}/`);
}

export const getCityAssets = (env, config) => {
  if (env.REACT_APP_CITY_CONFIG === 'whitelabel') {
    return path.resolve(config, '../assets/');
  }

  return path.resolve(config, 'assets/');
}

export const getCityPublic = (env, config) => {
  if (env.REACT_APP_CITY_CONFIG === 'whitelabel') {
    return path.resolve(config, '../public/');
  }

  return path.resolve(config, 'public/');
}
