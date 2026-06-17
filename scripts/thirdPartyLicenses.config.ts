import type { ThirdPartyLicensesConfig } from '@city-of-helsinki/license-notices';

const CKEDITOR_NOTE =
  'Offered by CKSource under "GPL-2.0-or-later or commercial license terms" ' +
  '(see its LICENSE.md). This distribution uses the open-source build ' +
  'under GPL-2.0-or-later.';

/**
 * Everything about the third-party license notices that is specific to this
 * repository. The generator itself comes from the license-notices package and
 * knows nothing about this project.
 */
export const thirdPartyLicensesConfig: ThirdPartyLicensesConfig = {
  repositoryUrl: 'https://github.com/City-of-Helsinki/kerrokantasi-ui',

  licenseDecisions: {
    dompurify: {
      license: 'Apache-2.0',
      note:
        'Offered by its author under "(MPL-2.0 OR Apache-2.0)". This ' +
        'distribution elects Apache-2.0, so the MPL-2.0 obligations do not ' +
        'apply to this component.',
    },
    // CKEditor 5 declares "SEE LICENSE IN LICENSE.md". Its LICENSE.md offers
    // GPL-2.0-or-later or commercial terms. The app runs the open-source
    // build (licenseKey 'GPL', see ckeditorLicenseKey in src/config.js).
    ckeditor5: {
      declared: 'SEE LICENSE IN LICENSE.md',
      license: 'GPL-2.0-or-later',
      note: CKEDITOR_NOTE,
    },
    '@ckeditor/*': {
      declared: 'SEE LICENSE IN LICENSE.md',
      license: 'GPL-2.0-or-later',
      note: CKEDITOR_NOTE,
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
