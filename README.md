# Silverstripe Admin Module

[![CI](https://github.com/silverstripe/silverstripe-admin/actions/workflows/ci.yml/badge.svg)](https://github.com/silverstripe/silverstripe-admin/actions/workflows/ci.yml)
[![Silverstripe supported module](https://img.shields.io/badge/silverstripe-supported-0071C4.svg)](https://www.silverstripe.org/software/addons/silverstripe-commercially-supported-module-list/)

## Overview

Provides a basic management UI for the [Silverstripe Framework](http://silverstripe.org).
Allows authors to manage their profile as well as members with their group and permission assignments.
Can be extended with the [silverstripe/cms](https://github.com/silverstripe/silverstripe-cms) module
to provide content management abilities.

## Installation

```sh
composer require silverstripe/admin
```

## Documentation

See [docs.silverstripe.org](https://docs.silverstripe.org)

## Versioning

This library follows [Semver](http://semver.org). According to Semver, you will be able to upgrade to any minor or patch version of this library without any breaking changes to the public API. Semver also requires that we clearly define the public API for this library.

All methods, with `public` visibility, are part of the public API. All other methods are not part of the public API. Where possible, we'll try to keep `protected` methods backwards-compatible in minor/patch versions, but if you're overriding methods then please test your work before upgrading.

## Reporting Issues

Please [create an issue](http://github.com/silverstripe/silverstripe-admin/issues) for any bugs you've found, or features you're missing.
