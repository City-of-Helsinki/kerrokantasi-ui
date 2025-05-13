import path from 'path';

import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

export const TEST_USER_EMAIL = process.env.E2E_TEST_USER_EMAIL ?? '';
export const TEST_USER_PASSWORD = process.env.E2E_TEST_USER_PASSWORD ?? '';

export const HEARING_DETAIL = {
  validHearingSlug: 'fluxhaven-seasonal-city',
  testSectionName: 'Teknologiset järjestelmät'
};

export const HEARINGS_LISTING = {
  hearingTitle: 'FluxHaven — Kausittain siirtyvä kaupunki',
  searchTerm: 'testi',
  labelText: 'testi'
};

export const SECTION_VIEW = {
  validHearingSlug: 'fluxhaven-seasonal-city',
  validSectionId: 'yEuinPrC9dekL6RA7hXARMu9v7kSCdh2'
};

export const USER_PROFILE = {
  commentText: 'kommentti'
};
