/* eslint-disable import/prefer-default-export */
import { expect } from '@playwright/test';
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from './constants';
import { AxeBuilder } from '@axe-core/playwright';
import { createHtmlReport } from 'axe-html-reporter';

/**
 * Utility functions for E2E tests
 */

/**
 * Accepts the cookie consent dialog if it appears
 * @param {import('@playwright/test').Page} page 
 */
async function acceptCookieConcent(page) {
  await page.waitForSelector('button[data-testid="cookie-consent-approve-button"]');
  const cookieButton = page.locator('button[data-testid="cookie-consent-approve-button"]');
  await cookieButton.click();
}

/**
 * Logs in to the application
 * @param {import('@playwright/test').Page} page 
 */
export const login = async (page) => {
  await page.getByRole('button', { name: 'Kirjaudu' }).click();

  await expect(page.locator('.login-pf-page')).toBeVisible();

  await page.getByRole('textbox', { name: 'Sähköposti' }).fill(TEST_USER_EMAIL);
  await page.getByRole('textbox', { name: 'Salasana' }).fill(TEST_USER_PASSWORD);

  await page.getByRole('button', { name: 'Kirjaudu sisään' }).click();
  // Wait for login to complete
  await page.waitForLoadState('networkidle');
}

export const hasLoginCredentials = TEST_USER_EMAIL !== '' && TEST_USER_PASSWORD !== '';

export async function axeCheckHandler(page, testInfo, disableRules = []) {
  await page.waitForLoadState('networkidle');

  const pageTitle = await page.title();
  const pageName = pageTitle.replace(/\s+/g, '-').toLowerCase();
  const browserName = testInfo.project.name;
  const reportFile = `${pageName}-${browserName}-axe-report.html`;

  // Run axe accessibility checks
  const accessibilityScanResults = await new AxeBuilder({ page })
    .disableRules(disableRules)
    .analyze();

  // Generate the HTML report
  createHtmlReport({
    results: accessibilityScanResults,
    options: {
      outputDir: './report/axe',
      reportFileName: reportFile,
    }
  });

  expect.soft(accessibilityScanResults.violations).toEqual([]);
}

/**
 * Cleans up DOM element by removing all classes and styles recursively
 * @param {HTMLElement} element - DOM element to clean
 * @returns {String} The cleaned HTML output
 */
export const cleanupDomElement = (element) => {
  const clonedElement = element.cloneNode(true);
  
  const removeClasses = (el) => {
    if (el.classList) {
      el.removeAttribute('class');
    }
    if (el.style) {
      el.removeAttribute('style');
    }
    for (const child of el.children) {
      removeClasses(child);
    }
  };
  
  removeClasses(clonedElement);
  return clonedElement.outerHTML;
};

module.exports = {
  acceptCookieConcent,
  login,
  axeCheckHandler,
  hasLoginCredentials,
  cleanupDomElement
};