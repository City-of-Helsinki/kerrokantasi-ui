import { test, expect } from '@playwright/test';

import { login, hasLoginCredentials } from '../utils';

test('Login', async ({ page }) => {
  test.skip(!hasLoginCredentials, 'No test user credentials provided');

  await page.goto('/');

  await login(page);

  await expect(page.getByRole('link', { name: 'Kerrokantasi' })).toBeVisible();
});
