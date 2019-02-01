# Badge Component

Badge component for displaying a message in a Bootstrap "badge" style.

## Example
```js
const props = {
  status: 'success',
  message: 'The save was successful.',
  className: 'action__result',
  inverted: false,
  stateBadge: false,
};
<Badge {...props} />
```

## Properties

 * `status` (string): The status for the badge, takes bootstrap's `success`/`warning`/`danger`/`info`/`default` values.
 * `message` (string): The string to display in the badge.
 * `className` (string): Any extra classes to apply for the badge.
 * `inverted` (boolean): If the colours should be inverted.
 * `stateBadge` (boolean): For use in the context of versioning states (use with inverted).
