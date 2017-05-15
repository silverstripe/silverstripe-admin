# InsertLinkModal Component

Generic Insert link modal, which handles common usecases such as field value overrides.
This relies on calling [FormBuilderModal](../../containers/FormBuilderLoader/README.md) to load a Form into the content of the modal.

Most properties are passed through to `FormBuilderModal`.

## Example

```js
return <InsertLinkModal
  show={showModal}
  schemaUrl="/schema/my-form-schema-url"
  onInsert={insertCallback}
  onHide={hideCallback}
/>
```

## Properties

 * `show` (boolean): Whether to show the modal or not.
 * `schemaUrl` (string): The url to call to obtain the form schema.
 * `onInsert` (function) (required): The callback for when something has been submitted.
 * `onHide` (function) (required): The callback for when the modal is to be hidden again. 

## Helpers

A `createInsertLinkModal` helper factory is provided, so that the schemaUrl could be obtained from the config instead.
You will need to provide the `sectionConfigKey` and `formName` to look for.

```js
createInsertLinkModal(
  'SilverStripe\\Admin\\LeftAndMain',
  'EditorExternalLink'
);
```