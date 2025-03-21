/* eslint-disable import/prefer-default-export */
import { expect } from '@playwright/test';

export const login = async (page, email, password) => {
  await page.getByRole('button', { name: 'Kirjaudu' }).click();

  await expect(page.locator('.login-pf-page')).toBeVisible();

  await page.getByRole('textbox', { name: 'Sähköposti' }).fill(email);
  await page.getByRole('textbox', { name: 'Salasana' }).fill(password);

  await page.getByRole('button', { name: 'Kirjaudu sisään' }).click();
}
