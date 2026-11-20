# Status Badge Component

Badge component for displaying one status flag of a record, such as "Draft" or "Modified". The status flags of a
record come from `getStatusFlags()`.

## Example
```js
const props = {
  status: 'modified',
  text: 'Modified',
};
<StatusBadge {...props} />
```

## Properties

 * `status` (string): The status of the record: `archived`, `draft` or `modified`. A badge without a status
   has the default colours.
 * `text` (node): The text to display in the badge.
