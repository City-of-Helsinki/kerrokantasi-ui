import { describe, expect, it } from 'vitest';

import { thirdPartyLicensesConfig } from '../thirdPartyLicenses.config';

describe('thirdPartyLicensesConfig', () => {
  // The decisions are the part of the notices that a reader cannot verify
  // from the bundle alone, so losing one has to fail a test.
  it('elects Apache-2.0 for the dual-licensed dompurify', () => {
    const decision = thirdPartyLicensesConfig.licenseDecisions?.dompurify;

    expect(decision?.license).toBe('Apache-2.0');
    expect(decision?.note).toContain('(MPL-2.0 OR Apache-2.0)');
  });

  it('lists the Sass-inlined packages the bundler cannot see', () => {
    expect(thirdPartyLicensesConfig.sassResolvedPackages).toEqual(
      expect.arrayContaining([
        'bootstrap-sass',
        'font-awesome',
        'hds-core',
        'hds-design-tokens',
        'hel-bootstrap-3',
      ])
    );
  });
});
