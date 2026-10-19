import type { ThirdPartyLicensesConfig } from '@city-of-helsinki/license-notices';

/**
 * Everything about the third-party license notices that is specific to this
 * repository. The generator itself comes from the license-notices package and
 * knows nothing about this project.
 */
export const thirdPartyLicensesConfig: ThirdPartyLicensesConfig = {
  repositoryUrl: 'https://github.com/City-of-Helsinki/kerrokantasi-ui',

  licenseDecisions: {
    '@city-of-helsinki/react-helsinki-notification-manager': {
      license: 'MIT',
      note:
        'Declares no license in its package.json. The LICENSE file it ' +
        'ships is the MIT License, so this distribution states MIT.',
    },
    dompurify: {
      license: 'Apache-2.0',
      note:
        'Offered by its author under "(MPL-2.0 OR Apache-2.0)". This ' +
        'distribution elects Apache-2.0, so the MPL-2.0 obligations do not ' +
        'apply to this component.',
    },
  },

  // Imported only from the Sass entry points (assets/sass and
  // cities/helsinki/assets/sass), so the bundler never sees them.
  // hel-bootstrap-3 is used by the Helsinki theme only.
  sassResolvedPackages: [
    'bootstrap-sass',
    'font-awesome',
    'hds-core',
    'hds-design-tokens',
    'hel-bootstrap-3',
  ],
};
