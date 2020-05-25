# FileStatusIcon Component

Generates a file status icon element with a reactstrap tooltip.
The icon and tooltip text is controlled via boolean props on the component rather than passed in as strings.

## Example

```js
<FileStatusIcon fileID={123} hasRestrictedAccess={1} includeBackground={1} />
```

## Properties

 * `fileID (number)`: The database ID of the file,
 * `hasRestrictedAccess (boolean)`: Whether the file has restricted access / permissions,
 * `isTrackedFormUpload (boolean)`: Whether the file is associated with a tracked form upload,
 * `placement (string)`: Reactstramp tooltip position,
 * `disableTooltip (boolean)`: Disable the reactstrap tooltip,
 * `extraClassName (string)`: Extra class the component should have,
 * `includeBackground (boolean)`: Whether to render the icon on a white circle background