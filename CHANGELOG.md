# Changelog

## [1.6.0](https://github.com/City-of-Helsinki/kerrokantasi-ui/compare/kerrokantasi-ui-v1.5.0...kerrokantasi-ui-v1.6.0) (2024-08-07)


### Features

* Sentry add beforeSend KER-376 ([42c20b5](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/42c20b5e849391c8990aba9d763290c71abc560a))

## [1.5.0](https://github.com/City-of-Helsinki/kerrokantasi-ui/compare/kerrokantasi-ui-v1.4.0...kerrokantasi-ui-v1.5.0) (2024-08-06)


### Features

* CookieUtils getCookie is array KER-376 ([22d658a](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/22d658ac011b17fd01d5eab90b01cd94fff1cbdd))
* CreateStore use Sentry integration KER-376 ([ee11e56](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/ee11e56a98037c536ac26e3a347a59f638d63b30))
* HearingEditor actions catch error KER-376 ([de2edcd](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/de2edcd726797da4533897502be13c7dd39bd498))
* Replace raven-js with sentry/react KER-376 ([463f92d](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/463f92d49550b9f7cd3489ca64c92c2c1d3dd502))


### Bug Fixes

* Env variable name sentryDsn KER-376 ([8df2e2b](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/8df2e2b81871b8ba084765cbd01fa64834cc6b51))

## [1.4.0](https://github.com/City-of-Helsinki/kerrokantasi-ui/compare/kerrokantasi-ui-v1.3.0...kerrokantasi-ui-v1.4.0) (2024-06-27)


### Features

* Comment report modal replace bootstrap KER-298 ([c06a33e](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/c06a33ee30752547e8c43e7826fe0688fe880843))
* Contact modal replace bootstrap KER-298 ([a6648e8](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/a6648e814d5cddedd29d21105ded6cb5d44e35f4))
* Delete modal replace with HDS dialog KER-298 ([d9bfe10](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/d9bfe10453dc263cc8b52e23c9f8b8cccc9e88b1))
* Hearing editor modal replace bootstrap KER-298 ([a6c910b](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/a6c910b795be438ea20e08da5e118b310f3e7021))
* Hearing form move out of modal KER-298 ([cb81526](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/cb81526a0fb999a3362d5fdf67432f094b5ed428))
* Iframe modal replace bootstrap KER-298 ([f6ea7e2](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/f6ea7e260cba19258ec58f0371d7a2ee55117dfa))
* Image modal replace boostrap KER-298 ([ab935c0](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/ab935c0036c1c8428c134840ea5bc565cc6c3cc6))
* Label modal replace bootstrap KER-298 ([7806ebd](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/7806ebd07726eb969870d0e9f5efbb350d6f4fd5))
* Skip link modal replace bootstrap KER-298 ([b4f5637](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/b4f563783d2c2280d2e3bf89c3c8749af444efb1))


### Bug Fixes

* Dialogs use correct colors KER-298 ([be19fb0](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/be19fb0585a4ecc5d6b5d93f790d424351cc8f4e))
* Hearing modal should never overlap children KER-298 ([551ae45](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/551ae454f1cf8eeda113c2a2de8d327d96ca3d76))
* Modal button orders, change hel theme danger color KER-298 ([645fdca](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/645fdca824a3586437767bab779b0d8784d25e79))

## [1.3.0](https://github.com/City-of-Helsinki/kerrokantasi-ui/compare/kerrokantasi-ui-v1.2.6...kerrokantasi-ui-v1.3.0) (2024-05-14)


### Features

* New service-info texts for profile change ([#1000](https://github.com/City-of-Helsinki/kerrokantasi-ui/issues/1000)) ([68afd0b](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/68afd0ba2edd7039b86a6376d1f6d9007dbe0ebc))

## [1.2.6](https://github.com/City-of-Helsinki/kerrokantasi-ui/compare/kerrokantasi-ui-v1.2.5...kerrokantasi-ui-v1.2.6) (2024-05-13)


### Bug Fixes

* Hearing toolbar wait for metadata KER-345 ([#1032](https://github.com/City-of-Helsinki/kerrokantasi-ui/issues/1032)) ([0ba9c8a](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/0ba9c8a8b065dfcb0eb8a902a0ac4b3ea973bc7c))
* Subsections should show comment if not authenticated KER-361 ([#1030](https://github.com/City-of-Helsinki/kerrokantasi-ui/issues/1030)) ([b8db2c7](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/b8db2c74e0ad8643e939aa2d11915017d7c92bc3))

## [1.2.5](https://github.com/City-of-Helsinki/kerrokantasi-ui/compare/kerrokantasi-ui-v1.2.4...kerrokantasi-ui-v1.2.5) (2024-05-07)


### Bug Fixes

* Fix typos in maintenance notification ([bf314f4](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/bf314f4f84e24caed72dfab041302edb2d0a4a00))

## [1.2.4](https://github.com/City-of-Helsinki/kerrokantasi-ui/compare/kerrokantasi-ui-v1.2.3...kerrokantasi-ui-v1.2.4) (2024-05-07)


### Bug Fixes

* Don't assign a new file to a section before saving hearing ([0fbb9c8](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/0fbb9c830e8c9b8149aff8fa2b44d71729e6cdd0))
* Fix save hearing as copy ([094d901](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/094d9017dba80bbddabb11185bd4acbe3db40067))
* KER-353 new notificiation texts ([693e350](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/693e350d24f2335f6cf4385185f14dd28fcdb1a2))

## [1.2.3](https://github.com/City-of-Helsinki/kerrokantasi-ui/compare/kerrokantasi-ui-v1.2.2...kerrokantasi-ui-v1.2.3) (2024-04-26)


### Bug Fixes

* Fixed broken footer links for all non-finnish languages ([#1019](https://github.com/City-of-Helsinki/kerrokantasi-ui/issues/1019)) ([31b8077](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/31b807766f476e320d48aa05c0f18264b1004bf3))
* Guess who's back, back again, profiili is back ([6d7e1d8](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/6d7e1d8e9936781be7050ff041dba75231587d70))
* Refreshing the api token stored to redux store ([#1020](https://github.com/City-of-Helsinki/kerrokantasi-ui/issues/1020)) ([2af452c](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/2af452cec9310247f7c4abe0564545d48c79dc6c))
* Removed error handling and documented reason ([#1021](https://github.com/City-of-Helsinki/kerrokantasi-ui/issues/1021)) ([00ae063](https://github.com/City-of-Helsinki/kerrokantasi-ui/commit/00ae0636be48cf859986ffb5e9303709826bb515))
