import { test, expect } from '@playwright/test';

import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from '../constants';
import { login } from '../utils';

test('Login', async ({ page }) => {
  test.skip(
    TEST_USER_EMAIL === '' && TEST_USER_PASSWORD === '',
    'No test user credentials provided'
  );

  await page.goto('/');

  await login(page, TEST_USER_EMAIL, TEST_USER_PASSWORD);

  await expect(page.getByRole('link', { name: 'Kerrokantasi' })).toBeVisible();
});
