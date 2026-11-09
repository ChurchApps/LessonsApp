# Tests

| Tier | When | Command |
|---|---|---|
| Smoke | By hand or in the nightly run, against the local stack | `SMOKE_BASE_URL=http://localhost:3501 yarn test:smoke` |
| PR | Before pushing a PR branch | `yarn test` (the suite is small enough to run whole) |
| Full | Nightly | `yarn test` |

**Smoke** (`tests/smoke/`, `playwright.smoke.config.ts`) only reads. It walks home → program → study → lesson using whatever the catalog currently links, runs a search, and checks that the login page reaches the API. Any uncaught page error or 5xx fails it. LessonsApp has no demo site (`demo.lessons.church` does not resolve), so nothing runs it after a deploy. Smoke never runs against production: `playwright.smoke.config.ts` refuses any host that is not a demo or local host.

`harness.spec.ts` (formerly `smoke.spec.ts`) only checks that the test fixtures can sign in; it is part of the regular suite.
