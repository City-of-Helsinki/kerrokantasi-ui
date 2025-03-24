import path from 'path';

import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

export const TEST_USER_EMAIL = process.env.E2E_TEST_USER_EMAIL ?? '';
export const TEST_USER_PASSWORD = process.env.E2E_TEST_USER_PASSWORD ?? '';
