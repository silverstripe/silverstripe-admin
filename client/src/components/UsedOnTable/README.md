# UsedOnTable Component

Generates a generic table for loading a DataObject's ownership details.

Relies on the `SilverStripe\Admin\Forms\UsedOnTable` FormField class on the PHP side, can be used independently if desired.

## Example

```js
import UsedOnTable from 'components/UsedOnTable/UsedOnTable';

const metadata = {
  recordClass: 'Page',
  recordId: 2,
  readUsageEndpoint: {
    method: 'get',
    url: '/admin/form/20/field/UsedOnTable',
  },
};
<UsedOnTable data={metadata} />
```

## Independent usage example

```js
import { Component as UsedOnTable } from 'components/UsedOnTable/UsedOnTable';

const metadata = {
  loading: false,
  usedOn: [
    { id: 'id1', title: 'My custom item', type: 'Gallery', state: 'modified', link: 'http://www.google.co.nz' }
  ],
  error: null,
};
<UsedOnTable data={metadata} />
```
