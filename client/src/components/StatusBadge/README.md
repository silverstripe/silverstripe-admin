# Status Badge Component

Badge component for displaying one status flag of a record, such as "Draft" or "Modified". The status flags of a
record come from `getStatusFlags()`. A flag key is not a `status` value: map each key to a `status` first, as
`TreeView` does.

## Example
```js
const props = {
  status: 'modified',
  text: 'Modified',
};
<StatusBadge {...props} />
```

## Properties

 * `status` (string): The colour of the badge: `archived`, `draft` or `modified`. A badge without a status has the
   default colours.
 * `text` (node, required): The text to display in the badge.
