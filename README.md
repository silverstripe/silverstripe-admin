# SilverStripe Admin Module

[![Build Status](https://api.travis-ci.org/silverstripe/silverstripe-admin.svg?branch=master)](https://travis-ci.org/silverstripe/silverstripe-admin)
[![Latest Stable Version](https://poser.pugx.org/silverstripe/admin/version.svg)](http://www.silverstripe.org/stable-download/)
[![Latest Unstable Version](https://poser.pugx.org/silverstripe/admin/v/unstable.svg)](https://packagist.org/packages/silverstripe/admin)
[![Total Downloads](https://poser.pugx.org/silverstripe/admin/downloads.svg)](https://packagist.org/packages/silverstripe/admin)
[![License](https://poser.pugx.org/silverstripe/admin/license.svg)](https://github.com/silverstripe/silverstripe-admin#license)
[![Dependency Status](https://www.versioneye.com/php/silverstripe:admin/badge.svg)](https://www.versioneye.com/php/silverstripe:admin)
[![Reference Status](https://www.versioneye.com/php/silverstripe:admin/reference_badge.svg?style=flat)](https://www.versioneye.com/php/silverstripe:admin/references)
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

See [doc.silverstripe.org](http://doc.silverstripe.org)

## Versioning

This library follows [Semver](http://semver.org). According to Semver, you will be able to upgrade to any minor or patch version of this library without any breaking changes to the public API. Semver also requires that we clearly define the public API for this library.

All methods, with `public` visibility, are part of the public API. All other methods are not part of the public API. Where possible, we'll try to keep `protected` methods backwards-compatible in minor/patch versions, but if you're overriding methods then please test your work before upgrading.

## Reporting Issues

Please [create an issue](http://github.com/silverstripe/silverstripe-admin/issues) for any bugs you've found, or features you're missing.
