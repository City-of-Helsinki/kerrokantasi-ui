// Vendored from the shared accessibility test helpers (AccessibilityTests/helpers/playwright-axe).
// Change the shared copy first and re-copy; do not edit here only.

/**
 * Playwright accessibility check with WCAG 2.1 A/AA tags and a per-scan baseline.
 *
 * Usage (in a repo's e2e folder):
 *
 *   export const checkA11y = createA11yChecker({
 *     baselineDir: path.join(__dirname, 'a11y-baseline'),
 *   });
 *
 *   test('resource page', async ({ page }, testInfo) => {
 *     await page.goto('/resource/1');
 *     await checkA11y(page, testInfo, 'resource page');
 *   });
 *
 * - Fails on violations not recorded in the scan's baseline file.
 * - `A11Y_UPDATE_BASELINE=1` rewrites the baseline file of every executed scan instead of failing.
 * - Baselined violations that no longer occur are reported as a test annotation.
 * - Full axe results are attached to the Playwright report.
 * - Scan names must be unique within a repo (they map to baseline file names).
 */
import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, type TestInfo } from '@playwright/test';

import {
  diffAgainstBaseline,
  formatViolations,
  readBaseline,
  type Violation,
  writeBaseline,
} from './baseline';

/** Target level: WCAG 2.1 AA (EU Web Accessibility Directive, Finnish digital services act). */
export const WCAG_21_AA_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
] as const;

export interface A11yCheckerOptions {
  /** Directory of per-scan baseline files, committed to the repo. */
  baselineDir: string;
}

export interface A11yScanOptions {
  /** CSS selectors limiting the scan to these regions. Default: whole page. */
  include?: string[];
  /**
   * CSS selectors left out of the scan. Use only for content we don't own (e.g. third-party
   * embeds), never to hide our own violations; those belong in the baseline with a ticket.
   */
  exclude?: string[];
}

export const isBaselineUpdate = (): boolean =>
  process.env.A11Y_UPDATE_BASELINE === '1';

export const createA11yChecker =
  ({ baselineDir }: A11yCheckerOptions) =>
  async (
    page: Page,
    testInfo: TestInfo,
    scanName: string,
    { include = [], exclude = [] }: A11yScanOptions = {}
  ): Promise<void> => {
    let builder = new AxeBuilder({ page }).withTags([...WCAG_21_AA_TAGS]);
    include.forEach((selector) => {
      builder = builder.include(selector);
    });
    exclude.forEach((selector) => {
      builder = builder.exclude(selector);
    });
    const results = await builder.analyze();
    const violations = results.violations as Violation[];

    await testInfo.attach(`a11y: ${scanName}`, {
      body: JSON.stringify(results, null, 2),
      contentType: 'application/json',
    });

    if (isBaselineUpdate()) {
      await writeBaseline(baselineDir, scanName, violations);
      return;
    }

    const diff = diffAgainstBaseline(
      violations,
      await readBaseline(baselineDir, scanName)
    );

    if (diff.fixedFingerprints.length > 0) {
      testInfo.annotations.push({
        type: 'a11y-baseline',
        description: `"${scanName}": ${diff.fixedFingerprints.length} baselined violation(s) no longer occur. Run with A11Y_UPDATE_BASELINE=1 to shrink the baseline.`,
      });
    }

    expect(
      diff.newFingerprints,
      `New accessibility violations in "${scanName}":\n${formatViolations(diff.newViolations)}`
    ).toEqual([]);
  };
