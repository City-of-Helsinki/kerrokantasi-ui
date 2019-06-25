const getOptions = require('../server/getSettings').default;
const path = require('path');

const settings = getOptions();

let cityConfig;
if (!settings.city_config || settings.city_config === 'cities/helsinki') {
  cityConfig = path.resolve(__dirname, `../cities/helsinki/`);
} else if (settings.city_config === 'whitelabel') {
  cityConfig = path.resolve(__dirname, `../src`);
} else {
  cityConfig = path.resolve(__dirname, `../node_modules/${settings.city_config}/`);
}
let cityAssets = path.resolve(cityConfig, 'assets/');
const cityi18n = path.resolve(cityConfig, 'i18n/');

if (settings.city_config === 'whitelabel') {
  cityAssets = path.resolve(cityConfig, '../assets/');
}

const cityImages = path.resolve(cityAssets, 'images/');
const cityAuth = path.resolve(cityConfig, 'functions/auth');

module.exports = {cityConfig, cityAssets, cityi18n, cityImages, cityAuth};
