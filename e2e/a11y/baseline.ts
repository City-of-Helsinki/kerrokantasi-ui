// Vendored from the shared accessibility test helpers (AccessibilityTests/helpers/playwright-axe).
// Change the shared copy first and re-copy; do not edit here only.

/**
 * Accessibility baseline: pure logic, no Playwright dependency.
 *
 * A baseline records known (pre-existing) axe violations per scan so legacy repos can block new
 * violations without first fixing all existing ones. A violation is identified by its rule id and
 * the axe selector of the failing element, with CSS module hashes removed from class names.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

/** Minimal shape of an axe-core result node (kept local: axe-core is not a direct dependency). */
export interface ViolationNode {
  target: readonly unknown[];
  html?: string;
  failureSummary?: string;
}

/** Minimal shape of an axe-core violation. */
export interface Violation {
  id: string;
  impact?: string | null;
  help: string;
  helpUrl: string;
  nodes: readonly ViolationNode[];
}

export interface BaselineFile {
  scan: string;
  violations: string[];
}

export interface BaselineDiff {
  /** Violations (restricted to their new nodes) that are not in the baseline. */
  newViolations: Violation[];
  newFingerprints: string[];
  /** Baselined fingerprints that no longer occur: the baseline can shrink. */
  fixedFingerprints: string[];
}

/** Shadow DOM / iframe targets are nested arrays in axe results. */
const targetToString = (target: readonly unknown[]): string =>
  target
    .map((part) =>
      Array.isArray(part) ? part.map(String).join(' >>> ') : String(part)
    )
    .join(' | ');

/*
 * CSS module class names carry a build hash that changes when the styles or the dependency
 * version change, which would make a baselined violation look new:
 * - HDS (hds-react): `Breadcrumb-module_link__wWMWR`, `breadcrumb_hds-breadcrumb__link__mrCFF`
 * - Vite apps: `_inputWrapper_1hrnq_8` (`_[local]_[hash]_[line]`)
 */
const HDS_MODULE_CLASS =
  /\.([A-Za-z][A-Za-z0-9]*-module_[A-Za-z0-9-]+|[a-z][a-z0-9-]*_hds-[A-Za-z0-9_-]*?)__[A-Za-z0-9_-]{5}(?![A-Za-z0-9_-])/g;
const VITE_MODULE_CLASS =
  /\._([A-Za-z][A-Za-z0-9-]*)_[a-z0-9]{5}_\d+(?![A-Za-z0-9_-])/g;
const QUOTED = /("[^"]*"|'[^']*')/;

/** Removes CSS module hashes from class names in a selector; quoted attribute values are kept. */
export const stripClassHashes = (selector: string): string =>
  selector
    .split(QUOTED)
    .map((part, i) =>
      i % 2 === 1
        ? part
        : part
            .replace(HDS_MODULE_CLASS, '.$1')
            .replace(VITE_MODULE_CLASS, '._$1')
    )
    .join('');

export const fingerprint = (ruleId: string, node: ViolationNode): string =>
  `${ruleId} ${stripClassHashes(targetToString(node.target))}`;

export const fingerprintsOf = (violations: readonly Violation[]): string[] =>
  [
    ...new Set(
      violations.flatMap((v) => v.nodes.map((n) => fingerprint(v.id, n)))
    ),
  ].sort();

export const diffAgainstBaseline = (
  violations: readonly Violation[],
  baseline: readonly string[]
): BaselineDiff => {
  const known = new Set(baseline);
  const newViolations = violations
    .map((v) => ({
      ...v,
      nodes: v.nodes.filter((n) => !known.has(fingerprint(v.id, n))),
    }))
    .filter((v) => v.nodes.length > 0);
  const current = new Set(fingerprintsOf(violations));
  return {
    newViolations,
    newFingerprints: fingerprintsOf(newViolations),
    fixedFingerprints: [...known].filter((f) => !current.has(f)).sort(),
  };
};

export const formatViolations = (violations: readonly Violation[]): string =>
  violations
    .map((v) => {
      const nodes = v.nodes
        .map((n) => `    - ${targetToString(n.target)}`)
        .join('\n');
      return `  [${v.impact ?? 'unknown'}] ${v.id}: ${v.help}\n    ${v.helpUrl}\n${nodes}`;
    })
    .join('\n');

/** Scan names become file names; keep them readable and filesystem-safe. */
export const scanFileName = (scanName: string): string => {
  const slug = scanName
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!slug) {
    throw new Error(`Invalid a11y scan name: "${scanName}"`);
  }
  return `${slug}.json`;
};

export const parseBaseline = (json: string, source: string): BaselineFile => {
  const data: unknown = JSON.parse(json);
  if (
    typeof data !== 'object' ||
    data === null ||
    typeof (data as BaselineFile).scan !== 'string' ||
    !Array.isArray((data as BaselineFile).violations) ||
    !(data as BaselineFile).violations.every((v) => typeof v === 'string')
  ) {
    throw new Error(`Malformed a11y baseline file: ${source}`);
  }
  return data as BaselineFile;
};

export const serializeBaseline = (
  scan: string,
  violations: readonly Violation[]
): string =>
  `${JSON.stringify({ scan, violations: fingerprintsOf(violations) }, null, 2)}\n`;

/** Returns an empty baseline when the scan has none: new scans must be clean. */
export const readBaseline = async (
  baselineDir: string,
  scanName: string
): Promise<string[]> => {
  const file = path.join(baselineDir, scanFileName(scanName));
  try {
    const parsed = parseBaseline(await fs.readFile(file, 'utf8'), file);
    if (parsed.scan !== scanName) {
      throw new Error(
        `a11y baseline ${file} belongs to scan "${parsed.scan}", not "${scanName}" (scan names must map to unique file names)`
      );
    }
    return parsed.violations;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

/** Writes the baseline for one scan; removes the file when the scan is clean. */
export const writeBaseline = async (
  baselineDir: string,
  scanName: string,
  violations: readonly Violation[]
): Promise<void> => {
  const file = path.join(baselineDir, scanFileName(scanName));
  if (violations.length === 0) {
    await fs.rm(file, { force: true });
    return;
  }
  await fs.mkdir(baselineDir, { recursive: true });
  await fs.writeFile(file, serializeBaseline(scanName, violations));
};
