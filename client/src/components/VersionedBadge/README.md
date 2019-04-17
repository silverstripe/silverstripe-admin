# Versioned Badge Component

Badge component for displaying versioning states in a Bootstrap "badge" based style.

## Example
```js
const props = {
  status: 'draft',
  message: 'Draft',
  className: 'my-custom-class',
};
<VersionedBadge {...props} />
```

## Properties

 * `status` (string): The status for the badge, takes versioning states e.g. `draft`, `modified`, `live`.
 * `message` (string): The string to display in the badge. Usually would be "Draft", "Published", etc.
 * `className` (string): Any extra classes to apply for the badge.
