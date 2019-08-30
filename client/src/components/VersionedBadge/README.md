# Versioned Badge Component

Badge component for displaying versioning states in a Bootstrap "badge" based style.

## Example
```js
const props = {
  status: 'draft',
  className: 'my-custom-class',
};
<VersionedBadge {...props} />
```

## Properties

 * `status` (string): The status for the badge, takes versioning states e.g. `draft`, `modified`, `live`, `archived`.
 * `className` (string): Any extra classes to apply for the badge.
