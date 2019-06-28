const getOptions = require('./getSettings').default;
const { cityAuth } = require('../conf/assetPaths');

const settings = getOptions();

// Default nulls for whitelabel and non-implemented auth
let authFunctions = {
  getPassport: null,
  addAuth: null,
};

try {
  if (settings.city_config !== 'whitelabel') {
    // eslint-disable-next-line import/no-dynamic-require
    authFunctions = require(cityAuth);
  }

  if (!('getPassport' in authFunctions && 'addAuth' in authFunctions)) {
    throw new Error("Required functions 'getPassport' and 'addAuth' were not found.");
  }
} catch (error) {
  /* Catch cases
   * 1. We are using non-whitelabel theme and it doesn't have the cityAuth module defined
   * 2. Either whitelabel or the selected theme doesn't have proper authFunctions implemented
   *
   * Try to display a reasonably visible warning on *compile time* and let the developer pass.
   */

  console.log(`
    #############################################

    NOTICE!

    Current theme ${settings.city_config} has no authentication backend implemented.

    See the file cities/helsinki/functions/auth.js for an example.
    For documentation see http://www.passportjs.org/docs/

    Error:
    ${error.message}

    #############################################
  `);
}

export const { getPassport, addAuth } = authFunctions;
