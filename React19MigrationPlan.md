# React 19 Migration Plan — kerrokantasi-ui

Target: upgrade `react` and `react-dom` from `^18.0.0` to `^19.x`.
Current state (verified): React 18.3.1, react-dom 18.3.1, Vite 8, Vitest 4, Node ≥ 22.13.1, pnpm ≥ 10.28.2.

This document is the authoritative, step-by-step migration plan. Each step has a checkbox so progress can be tracked.

> **Execution model:** When this plan is executed in follow-up tasks, the assistant will make the code changes for each step but will **not install or remove any packages** — the user performs every `pnpm add` / `pnpm remove` / lockfile update themself. The user verifies each concrete step (build, lint, tests, manual smoke) before signalling the assistant to proceed to the next step. Steps that require a package change explicitly mark which command the user needs to run.
>
> **Dependency-first rule:** For every concrete step that involves code changes, the necessary dependency update (upgrade / remove / replace) **must be performed first** — the assistant will not start the code migration for that step until the user confirms the package change has been applied (`pnpm install` completed, lockfile updated). The only exception is **replace** flows where the old package must remain installed until the swap compiles: in that case the new package is installed first (before any code change), and the old package is removed last (after the swap is verified). Every sub-step list below is ordered to follow this rule — a `**(user action)**` install/upgrade item appears as the **first** sub-step of any block that subsequently edits code.

> Legend: 🟢 low risk · 🟡 medium · 🔴 high · ⚙️ codemod available · 🧪 test required

---

## Phase 1 — Code-Level Changes Required by React 19

These changes are needed because of React 19 breaking changes or strongly recommended cleanups. They can (and should) be done **before** bumping the React version, while still on React 18.

### 1.1 Replace legacy class lifecycle methods (🔴 breaks behavior; UNSAFE_ still works with warnings)
React 19 keeps `UNSAFE_*` methods working but the React team intends to remove them; `componentWillUpdate` (non-UNSAFE) is already gone in StrictMode. Convert these to function components or to safe lifecycles.

- [x] **1.1.1** `src/components/SocialBar/Facebook.jsx` — uses `UNSAFE_componentWillMount`. Convert class → function component with `useEffect`/`useId` for the random id.
- [x] **1.1.2** `src/components/PluginContent.jsx` — uses `UNSAFE_componentWillReceiveProps`. Replace with `getDerivedStateFromProps` or `useEffect` after function conversion.
- [x] **1.1.3** `src/components/plugins/legacy/mapdon-ksv.jsx` — uses `componentWillUpdate`. Replace with `componentDidUpdate` (compare prev props) or function component + `useEffect`.

### 1.2 Remove `defaultProps` from function components (🔴 React 19 removes support for function-component defaultProps)
Class-component defaultProps still work; **function** component defaultProps are removed. Switch to ES default parameters.

Audit the following files for `defaultProps` and convert each function-component default to a destructured parameter default. Verify whether the host is a class or function:

- [x] **1.2.1** `src/utils/FormatRelativeTime.jsx` — converted by codemod
- [x] **1.2.2** `src/components/HearingList/HearingList.jsx` — converted by codemod
- [x] **1.2.3** `src/components/admin/SectionForm.jsx` — converted by codemod
- [x] **1.2.4** `src/components/Hearing/CommentList/index.jsx` — class → function component (useState/useEffect/useRef), defaultProps removed
- [x] **1.2.5** `src/components/Hearing/Comment/index.jsx` — converted by codemod
- [x] **1.2.6** `src/components/forms/TextArea.jsx` — converted by codemod
- [x] **1.2.7** `src/components/forms/MultiLanguageTextField.jsx` — class → function component, defaultProps removed
- [x] **1.2.8** `src/components/RichTextEditor/index.jsx` — class → function component (useState/useRef/useIntl, dropped injectIntl wrapper), defaultProps removed
- [x] **1.2.9** Test files referencing `defaultProps` (verify mocks still work):
  - `src/utils/__tests__/FormatRelativeTime.test.jsx`
  - `src/views/Auth/__tests__/loginCallback.test.jsx`
  - `src/components/__tests__/LabelList.test.jsx`
  - `src/components/__tests__/InternalLink.test.jsx`
  - `src/components/__tests__/SortableCommentList.test.jsx`
  - `src/components/__tests__/CommentFormErrors.test.jsx`
  - `src/views/UserHearings/__tests__/UserHearings.test.jsx`
  - `src/components/UserComment/__tests__/UserComment.test.jsx`
  - `src/components/Hearing/Comment/__tests__/ShowMore.test.jsx`
  - `src/components/Hearing/Comment/__tests__/Comment.test.jsx`
  - `src/components/RichTextEditor/__tests__/RichTextEditor.test.jsx`

A codemod is available: ⚙️ `npx codemod@latest react/19/replace-default-props`.

### 1.3 Verify no removed/changed APIs are in use (🟢 audit only)

- [x] **1.3.1** `ReactDOM.render` / `hydrate` — already migrated (see `src/index.js` uses `createRoot`). ✅
- [x] **1.3.2** `findDOMNode` — none in repo. ✅
- [x] **1.3.3** String refs — none in repo. ✅
- [x] **1.3.4** `react-test-renderer` / Enzyme — not used. ✅
- [x] **1.3.5** `propTypes` runtime checks — React 19 no longer warns; the `prop-types` package still works at dev time. Decide whether to keep PropTypes (recommended in the short term for safety since the codebase is JS, not TS) or strip them in a separate cleanup task.
- [ ] **1.3.6** `legacy context` (`contextTypes` / `childContextTypes`) — grep again before merge; currently none.

### 1.4 Optional React 19 ergonomics (🟢, not required — defer to a follow-up PR)

- [ ] **1.4.1** Use `<Context>` directly instead of `<Context.Provider>` (`src/getRoot.jsx`, `src/components/Matomo/matomo-context.jsx`, tests).
- [x] **1.4.2** Consider replacing `ref={forwardRef}` patterns — none in repo. ✅
- [ ] **1.4.3** `react-helmet` is being replaced with `react-helmet-async` (see 2.5) — not a React 19 native rewrite.

### 1.5 Update test setup for React 19 (🟡 🧪)

- [x] **1.5.1** **(user action — dependency first)** Before changing any test code, update `@testing-library/react` from `^15` → `^16` (peer-requires React 19): `pnpm add -D @testing-library/react@^16`. After install, re-run `pnpm test:cov` to capture the baseline.
- [x] **1.5.2** Ensure `IS_REACT_ACT_ENVIRONMENT` is set in `src/setupTests.js` (Vitest jsdom defaults usually handle this). Tests run without it.
- [x] **1.5.3** Re-run all 60+ test files using `@testing-library/react`; expect minor changes around `act()` warnings for async state updates.

### 1.6 Replace `react-helmet` with `react-helmet-async` (🟡 🧪)

`react-helmet-async` is API-compatible for the `<Helmet>` component but requires a `<HelmetProvider>` ancestor. This swap is independent of the React version bump and can land before Phase 4.

- [x] **1.6.1** **(user action — dependency first)** Install the replacement *before* any code change: `pnpm add react-helmet-async`. Do **not** remove `react-helmet` yet — keep both installed until the swap below compiles.
- [x] **1.6.2** Wrap the app in `<HelmetProvider>` in `src/getRoot.jsx` (outermost provider is fine).
- [x] **1.6.3** Update imports in all 10 consumer files:
  - `src/App.jsx`
  - `src/views/Home.jsx`
  - `src/views/Hearings/index.jsx`
  - `src/views/Hearing/HearingContainer.jsx`
  - `src/views/UserHearings/index.jsx`
  - `src/views/UserProfile/index.jsx`
  - `src/views/CookieManagement/index.jsx`
  - `src/views/BrowserWarning/index.jsx`
  - `src/components/HearingList/HearingList.jsx`
  - `src/components/MarkdownPage/MarkdownPage.jsx`

  Change `import Helmet from 'react-helmet'` and `import { Helmet } from 'react-helmet'` → `import { Helmet } from 'react-helmet-async'`.
- [x] **1.6.4** Update `src/utils/renderWithProviders.jsx` (and any test render helper) to include `<HelmetProvider>` so tests that mount `<Helmet>` don't throw.
- [x] **1.6.5** Run `pnpm test:cov` and verify titles/meta still render in dev (`pnpm start`).
- [x] **1.6.6** **(user action — cleanup)** Once the swap is verified, remove the old dependency: `pnpm remove react-helmet`.

---

### 1.7 Upgrade HDS (Helsinki Design System) 4 → 5 → 6 (🔴 🧪 — blocker for React 19)

`hds-react@6.0.0` is the first version that supports React 19. It can only be reached by going through v5 first. The v5 upgrade contains the bulk of the breaking changes; v6 is mostly a platform/React bump plus one removed component.

Affected packages (lockstep): `hds-react`, `hds-core`, `hds-design-tokens`.

References:
- HDS 5 migration guide: <https://hds.hel.fi/getting-started/tutorials/migrate-to-5.0.0/>
- HDS 6 migration guide: <https://hds.hel.fi/getting-started/tutorials/migrate-to-6.0.0/>

#### Repo audit (already verified)

| Breaking change in v5/v6 | Used in kerrokantasi-ui? | File(s) |
|---|---|---|
| `SearchInput` → `Search` (v5) | **Yes (1)** | `src/components/HearingList/HearingsSearch/HearingsSearch.jsx` |
| `Header.Search` API change (v5) | No | — |
| `Link` props/styling, `openInNewTabAriaLabel` → `openInNewTabLabel` (v5) | No (HDS `Link` not imported; routes use `react-router-dom`) | — |
| `Hero` layout/widths (v5) | No | — |
| Helsinki Grotesk Pro font (v5) | Visual only | global CSS |
| `--color-alert-dark` token value change (v5) | Visual only — review `Notification` styling | global CSS |
| `ErrorSummary` removed (v6) | No | — |
| Node.js ≥ 24 requirement (v6) | Current `engines.node` is `>=22.13.1` — **must bump** | `package.json`, CI runners, `.nvmrc` if present |
| React 19 peer (v6) | Triggers Phase 4 | — |

#### Step-by-step

##### 1.7.A — Upgrade to HDS 5 (still on React 18)

- [X] **1.7.A.1** **(user action — dependency first)** Before any HDS 5 code change, bump `hds-react`, `hds-core`, `hds-design-tokens` to the latest `^5.x` together: `pnpm add hds-react@^5 hds-core@^5 hds-design-tokens@^5`. Run `pnpm install` afterwards to surface peer warnings. Do not start 1.7.A.2 until the install is green.
- [X] **1.7.A.2** **Migrate `SearchInput` → `Search` in `src/components/HearingList/HearingsSearch/HearingsSearch.jsx`:**
  - Change import: `import { SearchInput, Button, Select } from 'hds-react'` → `import { Search, Button, Select } from 'hds-react'`.
  - Move `label`, `placeholder`, `helperText`, `searchButtonAriaLabel`, `clearButtonAriaLabel` into a single `texts` prop object.
  - Rename `onSubmit` → `onSend`.
  - `onChange` now receives `ChangeEvent<HTMLInputElement>` — update handler to use `e.target.value`.
  - Rename `hideSearchButton` → `hideSubmitButton` if present.
  - Rename `visibleSuggestions` → `visibleOptions` if present (default changed 8 → 5.5).
  - If `getSuggestions` is used: rewrite to `onSearch` returning `Promise<{ options: Array<{ label, value }> }>`.
  - Memoize the `texts` object via `useState`/`useMemo` and wrap `onSearch` in `useCallback` to prevent state resets (per HDS guide).
  - Update tests for this component if any.
- [x] **1.7.A.3** **Font check (Helsinki Grotesk Pro):** confirm the new font asset is delivered (HDS bundles it; check that the Vite/SCSS pipeline does not pin the old `Helsinki Grotesk` filename). Visually verify line-heights and headings on Hearing list, Hearing detail, Header, Footer.
- [x] **1.7.A.4** **Color token `--color-alert-dark`** changed `#986700 → #d18200`. Search SCSS for hardcoded `#986700` and replace with the token. Visually verify any `Notification type="alert"` usage (Notification component is imported in multiple files).
- [x] **1.7.A.5** Even though we do not import HDS `Link`, the Core CSS no longer ships `.icon` / `.vertical-align-*` link classes — grep `assets/`/`src/` SCSS for these class names and remove any usage.
- [x] **1.7.A.6** `pnpm lint`, `pnpm test:cov`, `pnpm build` — fix regressions.
- [x] **1.7.A.7** Manual smoke test: site search, hearing list filters, comment form (uses HDS `TextArea`, `TextInput`, `Notification`, `Checkbox`, `RadioButton`, `SelectionGroup`, `Select`, `FileInput`, `Dialog`), admin hearing form (uses `Accordion`, `DateInput`, `TimeInput`, `Tabs`, `Fieldset`, `Tag`, `Tooltip`), login flow (`LoginProvider`, `LoginCallbackHandler`, `useOidcClient`, `useApiTokens`), cookie banner (`CookieBanner`, `CookieConsentContextProvider`, `CookieSettingsPage`).
- [x] **1.7.A.8** Merge HDS 5 PR before starting 1.7.B.

##### 1.7.B — Bump Node.js requirement to 24 (prep for HDS 6)

> **Pre-flight audit (verified):** every package currently in the lockfile satisfies Node 24 — no `engines.node` ranges exclude it. Key build tooling: `vite@8` (`^20.19 || >=22.12`), `vitest@4` (`^20 || ^22 || >=24`), `jsdom@26` (`>=18`), `sass@1.99` (`>=14`), `esrun@3` (`>=14`), `husky@8` (`>=14`), `nyc@17` (`>=18`), `eslint@9` (`^18.18 || ^20.9 || >=21.1`), `prettier@3` (`>=14`). No direct use of removed Node APIs (`url.parse`, builtin `punycode`, legacy `Buffer(num)`) in `scripts/` or `deploy/`. ✅
>
> **Infrastructure caveats (blockers, must be resolved before 1.7.B.3):**
> - The Dockerfile base image is `helsinki.azurecr.io/ubi9/nodejs-22-pnpm-builder-base`. A `nodejs-24-pnpm-builder-base` equivalent must exist in the Helsinki Azure Container Registry. Coordinate with the platform team if it does not.
> - CI uses the reusable workflow `City-of-Helsinki/.github/.github/workflows/ci-pnpm-node.yml` with `node-version: 22.x`. Verify that the reusable workflow supports `24.x` (it should — `setup-node@v4` handles 24).

- [x] **1.7.B.1** Update `package.json` `engines.node` from `>=22.13.1` to `>=24.0.0` (or pin the current Node 24 LTS minor).
- [x] **1.7.B.2** Update `.nvmrc` from `v22.13.1` to the chosen Node 24 LTS version (e.g. `v24.x.x`).
- [x] **1.7.B.3** Update `Dockerfile` `FROM helsinki.azurecr.io/ubi9/nodejs-22-pnpm-builder-base` → the Node 24 equivalent. Confirm tag exists in the registry **before** opening the PR.
- [x] **1.7.B.4** Update `.github/workflows/ci.yaml` `node-version: 22.x` → `24.x`. Check `codeql-analysis.yml` and `release-please.yml` for any Node pins (none currently — verify).
- [x] **1.7.B.5** Verify `pnpm@10.28.2` (pinned via `packageManager`) works on Node 24 — it does; pnpm 10 supports Node ≥ 18.12. No bump required.
- [x] **1.7.B.6** `husky@8` works on Node 24 but is a major behind. Consider a follow-up to `husky@9` (changes the `husky install` invocation in `postinstall`). **Not required** for this migration.
- [x] **1.7.B.7** Delete the obsolete `deploy/containerize.sh` / `deploy/docker_test.sh` Travis-era `TRAVIS_NODE_VERSION` checks **or** leave them as-is — they no-op outside Travis. (Optional cleanup.)
- [x] **1.7.B.8** **(user action)** Run `pnpm install` on Node 24 locally; then run `pnpm lint`, `pnpm test:cov`, `pnpm build`. Expect no errors. Investigate any new deprecation warnings.
- [x] **1.7.B.9** Run Playwright `pnpm test:e2e:ci` on Node 24 to baseline before HDS 6 / React 19 stacking.

##### 1.7.C — Upgrade to HDS 6 (concurrent with React 19 bump in Phase 4)

HDS 6 declares `peerDependencies: { "react": "^19.0.0", "react-dom": "^19.0.0" }`. It must be installed in the **same commit** as the React 19 bump (or the install will fail).

- [x] **1.7.C.1** **(user action — dependency first)** In the React 19 upgrade PR (Phase 4), the HDS 6 bump must land in the **same install** as `react@19` / `react-dom@19` because HDS 6 peer-requires React 19. Run together: `pnpm add react@^19 react-dom@^19 hds-react@^6 hds-core@^6 hds-design-tokens@^6`. Do not start the 1.7.C code changes (or any other Phase 4 code change) until this combined install succeeds.
- [x] **1.7.C.2** Confirm `ErrorSummary` is not used (already verified above ✅). If new code added it in the meantime, replace with `<Notification type="error" notificationAriaLabel="…" autofocus>…</Notification>`.
- [x] **1.7.C.3** Verify `@city-of-helsinki/react-helsinki-notification-manager` is compatible with `hds-react@6`. If not, hold it on `hds-react@5` is not an option — file an upstream issue or vendor the small surface (it is only `0.1.0`).
- [x] **1.7.C.4** **(user action)** Run `pnpm install`, then `pnpm lint`, `pnpm test:cov`, `pnpm build` — see Phase 4 for the full integration checklist.

---

### 1.8 Replace `react-image-lightbox` with `yet-another-react-lightbox` (🟡 🧪)

`react-image-lightbox` is abandoned and pins React ≤17. Swap to `yet-another-react-lightbox` (YARL) — actively maintained, React 19-ready, ESM/TS. This change is independent of the React bump and can land any time.

Affected files (2): `src/components/Hearing/Section/SectionImage.jsx`, `src/components/Hearing/Section/SectionContainer.jsx`.

#### API translation reference

| `react-image-lightbox` | `yet-another-react-lightbox` |
|---|---|
| `import Lightbox from 'react-image-lightbox'` | `import Lightbox from 'yet-another-react-lightbox'` |
| `import 'react-image-lightbox/style.css'` | `import 'yet-another-react-lightbox/styles.css'` |
| `mainSrc={url}` | `slides={[{ src: url, alt, description }]}` |
| `onCloseRequest={closeLightbox}` | `close={closeLightbox}` |
| `showLightbox && <Lightbox … />` (conditional mount) | `<Lightbox open={showLightbox} close={closeLightbox} … />` (always mounted; controlled via `open`) |
| `reactModalProps={{ className: 'image-lightbox' }}` | Pass `className` directly or via `styles`/`render` props |

#### Steps

- [x] **1.8.1** **(user action — dependency first)** Install the replacement *before* any code change: `pnpm add yet-another-react-lightbox`. Do **not** remove `react-image-lightbox` yet — both must coexist until the swap compiles (handled in 1.8.7).
- [x] **1.8.2** Update `src/components/Hearing/Section/SectionImage.jsx`:
  - Swap the import.
  - Replace the `<Lightbox …>` JSX with `<Lightbox open={showLightbox} close={closeLightbox} slides={[{ src: image.url, alt: defineImageAlt() }]} />`.
  - Drop the `{showLightbox && …}` conditional wrap (YARL handles mount/unmount via `open`).
  - Preserve the existing `image-lightbox` class if any CSS targets it — pass `className="image-lightbox"` or use the `styles` API.
- [x] **1.8.3** Update `src/components/Hearing/Section/SectionContainer.jsx`:
  - Change `import 'react-image-lightbox/style.css'` → `import 'yet-another-react-lightbox/styles.css'`.
  - No other changes needed (state plumbing `showLightbox/openLightbox/closeLightbox` is unchanged).
- [x] **1.8.4** Grep `assets/` and `src/` SCSS for `.image-lightbox` and the old `ril-*` class names (used by `react-image-lightbox`); update or remove rules that no longer apply.
- [x] **1.8.5** Optional: install plugins as needed (e.g. `Zoom`, `Captions`, `Fullscreen`) — current usage only needs single-image display, so default Lightbox is sufficient.
- [x] **1.8.6** `pnpm test:cov` and manual smoke test on hearing section images (open/close, ESC key, backdrop click, keyboard navigation, mobile swipe).
- [x] **1.8.7** **(user action)** Remove `react-image-lightbox` once the swap is verified: `pnpm remove react-image-lightbox`.

---

### 1.9 Replace `redux-actions` with `@reduxjs/toolkit` ✅ (🔴 🧪 — large, but mechanical)

`redux-actions` has been unmaintained since 2019 and has never been tested against modern Redux or React 19. The official replacement is **Redux Toolkit (RTK)**. RTK bundles `redux@5`, `immer`, and `reselect` — installing it covers Phase 2.27 (`redux@5`) and reduces dependency surface. It also lets us **gradually** remove `updeep` and `immutability-helper` since RTK reducers run inside Immer.

**Why it is in Phase 1 (pre-React 19), not Phase 5:**
- `react-redux@9` (Phase 2.3) requires `redux@5`. RTK gives us `redux@5` transitively.
- Doing this swap with React 18 still installed isolates Redux risk from React-render risk. Smaller blast radius per PR.
- After this PR, `connect()` HOCs and `useSelector`/`useDispatch` continue to work unchanged.

**Scope (verified by grep):**
- `createAction` usage: 5 files (`src/actions/user.js`, `src/actions/index.js`, `src/actions/hearingEditor.js`, `src/views/Hearing/HearingContainer.jsx`, plus 1 test).
- `handleActions` usage: ~13 reducer files under `src/reducers/`.
- `combineActions` usage: 2 files (`reducers/hearingEditor/sections.js`, `reducers/hearingEditor/hearing.js`).
- Total occurrences: ~175.
- Existing infra worth preserving: 3 custom middlewares (`headless`, `hearingEditor`, `language`), `redux-thunk`, `Sentry.createReduxEnhancer()`, Redux DevTools extension hookup, dynamic `combineReducers` for slices. All of this is compatible with `configureStore` from RTK.

**Risk hot spots:**
- `updeep` returns frozen objects; RTK reducers use Immer, which expects mutable drafts. Reducers that **return a new `updeep` result** keep working (RTK detects `return` and skips Immer). Reducers that **mutate the draft** rely on Immer. Mixing both styles is supported, but converting reducers gradually requires care that no reducer both mutates and returns.
- `combineActions(...)` returned a special action type that `handleActions` matched. The RTK equivalent is `builder.addMatcher(isAnyOf(actA, actB), reducer)` — not a key on the case object. The 2 affected reducers need a slightly different `createReducer` shape.
- `createAction('foo')()` from `redux-actions` produces `{ type: 'foo' }`. RTK's `createAction('foo')` produces an action creator with a `.type === 'foo'` getter and a `.toString()` so it can be used as an object key. Behaviour-compatible **as long as no code reads `action.type` and expects a manually-constructed object**.
- The 175 string action types like `EditorActions.RECEIVE_HEARING` are bare strings — keep them as strings in `addCase`; do not auto-convert to `createAction` everywhere.

#### Step-by-step

##### 1.9.A — Install & wire up (no behaviour change yet)

- [x] **1.9.A.1** **(user action — dependency first)** Before touching `createStore.js`, add `@reduxjs/toolkit` to dependencies: `pnpm add @reduxjs/toolkit`. Do **not** remove `redux`, `redux-actions`, or `redux-thunk` yet — all can coexist. Wait for `pnpm install` to succeed before starting 1.9.A.2.
- [x] **1.9.A.2** Rewrite `src/createStore.js` to use `configureStore`:
  - Keep all 3 custom middlewares.
  - Disable RTK's default `serializableCheck` and `immutableCheck` if existing state contains non-serialisable values (e.g. `history`, `updeep`-frozen objects, Sentry objects). Decide per-middleware after a first run.
  - Replace the manual `thunk` import — RTK includes thunk by default.
  - Re-add `Sentry.createReduxEnhancer()` via the `enhancers` option.
  - Redux DevTools is auto-wired by `configureStore` — remove the manual `window.__REDUX_DEVTOOLS_EXTENSION__` plumbing.
- [x] **1.9.A.3** Smoke test: `pnpm start`, click through hearing list, hearing detail, login, comment submission, admin hearing form. Confirm state shape in DevTools is unchanged.
- [x] **1.9.A.4** Run full test suite + Playwright. Baseline before any reducer rewrites.

##### 1.9.B — Migrate `createAction` call sites (small, do first)

- [x] **1.9.B.1** Swap `import { createAction } from 'redux-actions'` → `import { createAction } from '@reduxjs/toolkit'` in the 5 files.
- [x] **1.9.B.2** Audit every call: `createAction('foo')(payload)` → `createAction('foo')(payload)` still works. **However**, if the call site does `createAction('foo')()` with no payload, RTK requires `createAction<void>('foo')` in TS — fine for our JS.
- [x] **1.9.B.3** Watch for code that pulls `.type` off the creator and assumes a manually-built `{type}` object — RTK's `.type` is a getter and behaves the same, but worth verifying in `src/views/Hearing/HearingContainer.jsx` where the import is inside a view (not an action module).
- [x] **1.9.B.4** Run all tests; verify Redux DevTools shows the same action type strings.

##### 1.9.C — Migrate reducers one slice at a time (large, mechanical)

For each of the 13 reducer files, in this suggested order (simplest first):

1. `src/reducers/projectLists.js`
2. `src/reducers/accessibility.js`
3. `src/reducers/labels.js`
4. `src/reducers/oidc.js`
5. `src/reducers/sectionComments.js`
6. `src/reducers/hearingLists.js`
7. `src/reducers/user.js`
8. `src/reducers/hearing.js`
9. `src/reducers/hearingEditor/contactPersons.js`
10. `src/reducers/hearingEditor/labels.js`
11. `src/reducers/hearingEditor/organizations.js`
12. `src/reducers/hearingEditor/index.js`
13. `src/reducers/hearingEditor/sections.js` *(uses `combineActions`)*
14. `src/reducers/hearingEditor/hearing.js` *(uses `combineActions`)*

For each slice:

- [x] **1.9.C.x.1** Replace import: `import { handleActions } from 'redux-actions'` → `import { createReducer } from '@reduxjs/toolkit'`.
- [x] **1.9.C.x.2** Convert `handleActions({ [TYPE]: handler, … }, INITIAL)` to:
  ```js
  createReducer(INITIAL, (builder) => {
    builder
      .addCase(TYPE, handler)
      .addCase(TYPE2, handler2);
  });
  ```
- [x] **1.9.C.x.3** **Do not change handler bodies in the same PR.** Continue to return new state via `updeep` / spread — RTK detects the `return` and skips Immer. This isolates the conversion risk.
- [x] **1.9.C.x.4** For `combineActions(A, B, C)` (2 files only): import `isAnyOf` from `@reduxjs/toolkit` and use `.addMatcher(isAnyOf(A, B, C), handler)` instead of a case key. Mind matcher ordering: matchers run after all `addCase` entries.
- [x] **1.9.C.x.5** Add/extend a unit test per slice that dispatches each action type and asserts the resulting state, **before** rewriting. Use these as the regression net.
- [x] **1.9.C.x.6** Run unit tests + Playwright after each slice. Merge slice-by-slice rather than as one large PR.

##### 1.9.D — Cleanup

- [x] **1.9.D.1** **(user action)** Remove `redux-actions` after slice 14 is merged: `pnpm remove redux-actions`.
- [x] **1.9.D.2** **(user action)** Remove `redux-thunk` (RTK supplies it; verify no direct `import { thunk } from 'redux-thunk'` remains): `pnpm remove redux-thunk`.
- [x] **1.9.D.3** **(user action)** Remove direct `redux` dependency only if nothing imports from it after the swap (RTK re-exports `combineReducers`, `compose`, etc.). Otherwise leave it. Command if removing: `pnpm remove redux`.
- [x] **1.9.D.4** **Optional follow-up (defer):** convert individual reducers to use Immer-style mutating drafts and remove `updeep` / `immutability-helper`. Do this in dedicated PRs after this migration ships.
- [x] **1.9.D.5** **Optional follow-up (defer):** consolidate slices using `createSlice` (combines actions + reducer). High effort, low value during this migration window.

##### 1.9.E — Guardrails

- [x] **1.9.E.1** Add a Redux DevTools state snapshot before starting 1.9.A and after each slice — diff to confirm the action stream and state shape are unchanged.
- [x] **1.9.E.2** Keep the `redux-actions` package installed throughout 1.9.B–1.9.C so a partially-migrated codebase still builds.
- [x] **1.9.E.3** Roll back per-slice if a regression appears — slices are independent.

---



Decisions for every dependency whose React peer range excludes React 19, or that is unmaintained/abandoned.

| # | Package | Current | React 19 status | Strategy | Notes |
|---|---|---|---|---|---|
| 2.1 | `react` | 18.3.1 | — | **Upgrade** → `^19.x` | Core target. |
| 2.2 | `react-dom` | 18.3.1 | — | **Upgrade** → `^19.x` | Lockstep with `react`. |
| 2.3 | `react-redux` | 8.1.3 | Requires v9+ | **Upgrade** → `^9.x` | v9 drops React 17 support, requires React 18.0+ and supports 19. No code change for hooks; `connect()` still works. |
| 2.4 | `react-router-dom` | ~~6.30.3~~ → **7.x** ✅ | v6.30+ already accepts React 19 (`">=16.8"`); v7 is the actively-developed line | **Done** — upgraded to v7 via phased migration (future flags → v7 bump). See `react-router-dom-v7-migration.md`. | All future flags are now v7 defaults; no code-level import changes required. |
| 2.5 | `react-helmet` | 6.1.0 | Unmaintained, peer `^16.x` | **Replace** → `react-helmet-async` | Drop-in API for `<Helmet>`. Requires wrapping the app tree in `<HelmetProvider>` (add in `src/getRoot.jsx`). Update imports in 10 files: change `import Helmet from 'react-helmet'` / `import { Helmet } from 'react-helmet'` → `import { Helmet } from 'react-helmet-async'`. `react-helmet-async` peer declares React 16/17/18; verify React 19 compat (community fork `@dr.pogodin/react-helmet` is the fallback if peer blocks install). |
| 2.6 | `react-intl` | 5.25.1 | v5 peer is React ≤18 | **Upgrade** → `^7.x` | v6→v7 dropped some APIs (`addLocaleData`, `injectIntl` HOC still present in v6 but generally deprecated). ~100+ message sites; mostly `<FormattedMessage>` / `useIntl()` which are stable. Plan parallel branch. |
| 2.7 | `react-i18next` | 15.7.4 | Supports React 19 | **Remove** | Not imported anywhere in `src/`. Pure dead weight. |
| 2.8 | `i18next` | 25.x | — | **Remove** | Only referenced via `react-i18next`. Verify no transitive consumer. |
| 2.9 | `react-leaflet` | 4.2.1 | v4 peer requires React 18; v5 supports React 19 | **Upgrade** → `^5.x` | API mostly compatible; `MapContainer` etc. unchanged. Update `react-leaflet-draw` peer accordingly. |
| 2.10 | `react-leaflet-draw` | 0.20.4 | Last release supports react-leaflet v4 | **Hold / pin / fork** | If 2.9 upgrades to v5, this lib is the blocker. Options: (a) keep on v4 + Leaflet draw via direct Leaflet API, (b) use community fork, (c) write thin wrapper. Decide before 2.9. |
| 2.11 | `react-image-lightbox` | 5.1.1 | Abandoned, peer `^16/17` | **Replace** → `yet-another-react-lightbox` | Actively maintained, React 19 compatible, TypeScript-first, modular plugins (Zoom, Fullscreen, Thumbnails, Captions). API differs from `react-image-lightbox` — uses `slides` array + `open`/`close` props instead of `mainSrc`/`onCloseRequest`. See Phase 1.8 for the concrete swap (2 files). |
| 2.12 | `react-twitter-widgets` | 1.10.0 | Peer `^16/17`, unmaintained | **Replace or remove** | Used only in `src/components/SocialBar/Twitter.jsx`. Replace with a direct Twitter/X embed `<script>` loader or remove if no longer required. |
| 2.13 | `react-anchor-link-smooth-scroll` | 1.0.12 | Peer `^15/16`, unmaintained | **Replace** | Used only in `src/components/InternalLink.jsx`. Replace with a 10-line `scrollIntoView({ behavior: 'smooth' })` helper. |
| 2.14 | `react-nl2br` | 1.0.4 | Peer `^15/16`, unmaintained | **Replace inline** | Used in `Comment/index.jsx`, `UserComment.jsx`. Replace with `text.split('\n').flatMap((s, i) => [i ? <br key={i}/> : null, s])`. |
| 2.15 | `react-waypoint` | 9.0.3 | Peer allows React 18+; React 19 not yet declared | **Upgrade** → latest (`^10.x` when published) **or** keep with peer override | If no React 19 release, consider `IntersectionObserver` hook. Used in `HearingList`, `SortableCommentList`. |
| 2.16 | `react-router-hash-link` | ~~2.4.3~~ → **removed** ✅ | Peer `react-router-dom@^6` | **Done** — replaced inline in `src/components/LinkWithLang.jsx` (Option C.2), then removed. | Hash scroll now uses native `scrollIntoView({ behavior: 'smooth' })`. |
| 2.17 | `react-anchor-link-smooth-scroll` | see 2.13 | | | |
| 2.18 | `react-device-detect` | 2.2.3 | Works with React 19 (no peer constraint on react-dom internals) | **Keep / monitor** | Only used to detect IE in `getRoot.jsx`. Consider removing — IE detection in 2026 is obsolete. |
| 2.19 | `@testing-library/react` | 15.0.7 | v15 peer is React 18 | **Upgrade** → `^16.x` | Required for React 19 act behavior. |
| 2.20 | `@sentry/react` | 9.22.0 | Supports React 19 | **Keep** | No action. |
| 2.21 | `hds-react` (City of Helsinki Design System) | 4.9.0 | v4 peer `^17/18`; v5 still React 18; **v6 requires React 19** | **Upgrade in two steps** → 4.9 → 5.x → 6.x | See Phase 1.7 for the concrete step-by-step plan. v6 is the version that unblocks React 19. |
| 2.22 | `hds-core` | 4.9.0 | Coupled to `hds-react` | **Upgrade in lockstep** → 5.x → 6.x | Bumped together with `hds-react`. |
| 2.23 | `hds-design-tokens` | 4.9.0 | Coupled to `hds-react` | **Upgrade in lockstep** → 5.x → 6.x | `--color-alert-dark` token value changes in v5 (`#986700` → `#d18200`). |
| 2.24 | `@city-of-helsinki/react-helsinki-notification-manager` | 0.1.0 | Peer unknown | **Verify** | Check peer range; likely follows hds-react. |
| 2.25 | `draft-js` + `@draft-js-plugins/*` | latest published | Abandoned by FB; peer `^16/17/18` | **Keep with peer override (short term) / Replace (long term)** | Used heavily by `RichTextEditor`. React 19 mostly works at runtime, but Draft's `findDOMNode` usage may break. Plan a replacement (e.g., Lexical, TipTap, Slate) as a separate epic. |
| 2.26 | `draft-convert`, `draft-js-export-html` | — | Linked to draft-js | **Keep** with draft-js. |
| 2.27 | `react-redux` peer `redux` | redux 3.7.2 | Outdated | **Replaced transitively** by `@reduxjs/toolkit` in Phase 1.9 (RTK depends on `redux@5`). | No separate install needed. |
| 2.28 | `redux-actions` | 2.6.5 | Unmaintained since 2019, no React dep | **Replace** → `@reduxjs/toolkit` | 19 files, ~175 usages of `createAction` / `handleActions` / `combineActions`. Concrete step-by-step plan in Phase 1.9. **Sequenced before the React 19 bump** because RTK pulls in modern `redux@5` (also required by `react-redux@9` in Phase 2.3). Treat as the largest non-component change in this migration — proceed in slice-by-slice PRs. |
| 2.29 | `redux-thunk` | 3.1.0 | OK | **Remove after 1.9** | Bundled by `@reduxjs/toolkit`. |
| 2.30 | `redux` (core) | 3.7.2 | Outdated, conflicts with `react-redux@9` | **Replaced transitively** via `@reduxjs/toolkit` (which depends on `redux@5`). | See Phase 1.9. |
| 2.30 | `prop-types` | 15.7.2 | OK | **Keep (short term)** | See 1.3.5. |

---

## Phase 3 — Unused / Removable Dependencies (independent of React 19)

These can be cleaned up at any time and reduce surface area before the upgrade. Verify each with a fresh `grep` before removal.

- [ ] **3.1** `react-i18next` — **0 imports** in `src/`. **(user action)** `pnpm remove react-i18next`.
- [ ] **3.2** `i18next` — only consumed by `react-i18next`. **(user action)** `pnpm remove i18next` after 3.1.
- [ ] **3.3** `hel-bootstrap-3` — **0 imports** in `src/`. Assistant verifies no Sass `@import`; **(user action)** `pnpm remove hel-bootstrap-3`.
- [ ] **3.4** `font-awesome` — **0 imports** in `src/`. Assistant verifies no Sass `@import`; **(user action)** `pnpm remove font-awesome`.
- [ ] **3.5** `bootstrap-sass` — **0 imports** in `src/`. Assistant verifies SCSS does not `@import "bootstrap"`; **(user action)** `pnpm remove bootstrap-sass` if unused.
- [ ] **3.6** `intl` — only referenced by `src/commonInit.js` as an IE11 polyfill via `require.ensure`.
  - [ ] **3.6.1** **(user action — dependency first)** `pnpm remove intl`. The dynamic `require.ensure('intl', …)` branch in `commonInit.js` will fail to resolve at build time — that is expected and is fixed in 3.6.2.
  - [ ] **3.6.2** Assistant removes the IE11 polyfill branch in `src/commonInit.js`. Run `pnpm build` to confirm the dead import is gone.
- [ ] **3.7** `react-device-detect` — single usage to detect IE in `getRoot.jsx`. If IE is no longer supported:
  - [ ] **3.7.1** **(user action — dependency first)** `pnpm remove react-device-detect`. The `isIE` import in `getRoot.jsx` will break the build — that is expected and is fixed in 3.7.2.
  - [ ] **3.7.2** Assistant deletes the `BrowserWarning` short-circuit in `getRoot.jsx` (or replaces with a tiny `userAgent` regex if IE detection is still desired).
- [ ] **3.8** `simple-git` — assistant verifies it is build-time only; **(user action)** move from `dependencies` to `devDependencies` via `pnpm remove simple-git && pnpm add -D simple-git`.
- [ ] **3.9** **(user action)** Audit other suspects with `pnpm dlx depcheck` and remove zero-reference packages flagged.

---

## Phase 4 — Execute the React 19 Upgrade

Run after Phase 1, 2, and 3 are merged and green.

- [ ] **4.1** **(user action — dependency first, single combined install)** All React-19-related package bumps must land in **one** `pnpm add` invocation, because their peer ranges are mutually constraining (HDS 6 demands React 19, react-redux 9 demands React 18+, etc.). Run together:

  ```sh
  pnpm add react@^19 react-dom@^19 \
           react-redux@^9 react-leaflet@^5 react-intl@^7 react-router-dom@^7 \
           hds-react@^6 hds-core@^6 hds-design-tokens@^6
  pnpm add -D @testing-library/react@^16
  ```

  `react-helmet` → `react-helmet-async` is already handled in 1.6. Do not start the Phase 4 code changes below until this install succeeds.
- [ ] **4.2** Remove obsolete `pnpm.overrides` entries from `package.json` if no longer needed. Add temporary `peerDependencyRules.allowedVersions` overrides for unmaintained libs that still declare `react@<19` (e.g., draft-js plugins) — only when confirmed runtime-safe. (Assistant edits the file; user runs `pnpm install` to apply.)
- [ ] **4.3** **(user action)** Resolve any remaining peer-dep warnings surfaced by 4.1/4.2 one by one before proceeding.
- [ ] **4.4** `pnpm lint` — fix any rule changes from `eslint-plugin-react@7.37+` related to React 19.
- [ ] **4.5** `pnpm test:cov` — expect new `act` warnings; address them.
- [ ] **4.6** `pnpm build` — verify bundle output and manual chunk splitting still works (`vite.config.mjs` references `/react/` and `/react-dom/`).
- [ ] **4.7** Manual smoke test (dev server): login, hearing list, hearing detail, comment form, rich text editor, map view, admin hearing form, language switching.
- [ ] **4.8** Run Playwright suite: `pnpm test:e2e:ci`.

---

## Phase 5 — Post-upgrade Cleanup

- [ ] **5.1** Remove temporary peer-override hacks added in 4.3 once upstream packages publish React 19 support.
- [ ] **5.2** Open follow-up issues for: replacing `draft-js`, removing `prop-types` in favor of TypeScript (separate epic), replacing `redux-actions`.
- [ ] **5.3** Update `README.md` / `CHANGELOG.md` with the React version bump and any required developer actions.
- [ ] **5.4** Tag the release.

---

## Risk Summary

| Risk | Severity | Mitigation |
|---|---|---|
| `redux-actions` → Redux Toolkit migration | 🔴 | Slice-by-slice in Phase 1.9; keep both libs installed during the transition; reducers continue to use `updeep`/spread (no Immer mutation in the same PR). |
| Helsinki Azure CR lacks `nodejs-24-pnpm-builder-base` image | 🔴 | Verify in Phase 0 with platform team; blocker for 1.7.B.3. |
| `hds-react` v5/v6 migration (incl. `SearchInput` → `Search` and Node 24) | 🔴 | Sequenced upgrade (4→5→6) in Phase 1.7; v5 before React bump, v6 with React bump. |
| `react-leaflet-draw` blocks `react-leaflet@5` | 🟡 | Plan fork/wrapper in Phase 2.10. |
| `draft-js` runtime issues with React 19 (findDOMNode internally) | 🟡 | Smoke-test RichTextEditor heavily; plan Lexical migration if broken. |
| `react-intl` v5 → v7 jump | 🟡 | Do as standalone PR before React bump. |
| Removed function-component `defaultProps` | 🟡 | Use codemod; covered in 1.2. |

---

## Quick Reference — Affected File Counts (verified via grep)

- Function component `defaultProps`: **~19 source files** (see 1.2).
- `UNSAFE_*` / `componentWillUpdate`: **3 files** (1.1).
- `react-helmet` consumers: **10 files** (2.5).
- `react-redux` `connect()` HOCs: **~25 files** (no code change needed for v9).
- Test files using `@testing-library/react`: **61 files** (1.5).
- `react-intl` consumers: large (`<FormattedMessage>` / `useIntl` are stable across v5→v7).
