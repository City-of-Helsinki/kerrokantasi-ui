import path from 'path';

import { createA11yChecker } from './a11y';

/**
 * Accessibility scan with this repo's baseline (e2e/a11y-baseline).
 * Regenerate the baseline with `A11Y_UPDATE_BASELINE=1 pnpm test:e2e:docker`.
 */
export const checkA11y = createA11yChecker({
  baselineDir: path.join(__dirname, '..', 'a11y-baseline'),
});
