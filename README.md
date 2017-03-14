# SilverStripe Admin Module

[![Build Status](http://img.shields.io/travis/silverstripe/silverstripe-admin.svg?style=flat-square)](https://travis-ci.org/silverstripe/silverstripe-admin)
[![Code Quality](http://img.shields.io/scrutinizer/g/silverstripe/silverstripe-admin.svg?style=flat-square)](https://scrutinizer-ci.com/g/silverstripe/silverstripe-admin)
[![Code Climate](https://codeclimate.com/github/silverstripe/silverstripe-admin/badges/gpa.svg)](https://codeclimate.com/github/silverstripe/silverstripe-admin)
[![Version](http://img.shields.io/packagist/v/silverstripe/admin.svg?style=flat-square)](https://packagist.org/packages/silverstripe/admin)
[![License](http://img.shields.io/packagist/l/silverstripe/admin.svg?style=flat-square)](LICENSE.md)
![helpfulrobot](https://helpfulrobot.io/silverstripe/admin/badge)

## Overview

Provides a basic management UI for the [SilverStripe Framework](http://silverstripe.org).
Allows authors to manage their profile as well as members with their group and permission assignments.
Can be extended with the [silverstripe/cms](https://github.com/silverstripe/silverstripe-cms) module
to provide content management abilities.

## Installation

```
$ composer require silverstripe/admin
```

You'll also need to run `dev/build`.

## Documentation

See the [docs/en](docs/en/introduction.md) folder.

## Versioning

This library follows [Semver](http://semver.org). According to Semver, you will be able to upgrade to any minor or patch version of this library without any breaking changes to the public API. Semver also requires that we clearly define the public API for this library.

All methods, with `public` visibility, are part of the public API. All other methods are not part of the public API. Where possible, we'll try to keep `protected` methods backwards-compatible in minor/patch versions, but if you're overriding methods then please test your work before upgrading.

## Reporting Issues

Please [create an issue](http://github.com/silverstripe/silverstripe-admin/issues) for any bugs you've found, or features you're missing.
