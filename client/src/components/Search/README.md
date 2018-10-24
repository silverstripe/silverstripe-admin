# Search

Allows users to search by term or filter results with a sub form.

## Example usage
```jsx
<Search
  onSearch={this.handleSearch}
  id="AssetSearchForm"
  formSchemaUrl={searchFormSchemaUrl}
  onHide={this.handleClearSearch}
  displayBehavior="HIDEABLE"
  filters={filters}
/>
```

## Handlers

* onSearch (func): Method to execute when performing a search. Get called with an object containing all values of the search form.
* onClear (func): Method to execute when the clear action is performed.
* onHide (func): Method to execute when the Search self-hides. You only need to specify this if you're using an external mechanism to toggle the search.

## Properties
* display (string): Controls whatever the display of the search component. Possible values are `NONE`, `VISIBLE`, `EXPANDED`. `NONE` will display a search toggle if `displayBeahvior` is set to `TOGGLABLE`. Otherwise nothing will be rendered.
* displayBehavior (string): Controls how the user can interact with the display of the component. `TOGGLABLE` allows the user to hide and show the component. `HIDEABLE` allows the user to hide the component. `NONE` prevents the user for directly affecting the component's visibility.
* filters (object): Submitted data, if any.
* filterPrefix (string): Adds a prefix to the keys of the filters
* forceFilters (bool): Force the rendering of the advanced filters. (For demoing purpose)
* formData (object): Data to pre-populate the form with.
* formSchemaUrl (string): URL to the form schema to use for the filter form.
* id (string): Unique identifier.
* id (string): Form identifier pass to the underlying form builder. Defaults to `Admin.SearchForm`.
* name (string): Name that will be applied to the search input. This controls the attribute the search term will be attached to when `onSearch` is called. Defaults to `searchTerm`.
* placeholder (string): Placeholder for the form field. 
* term (string): Can be use to explicitly define what the current search term is.

## Customise how search tag filters are rendered

The Search component will attempt to detect which search filters are currently applied and render them as search tags. The tag will be rendered based on the `schemaType` of the matching field.

This can be customise by providing `tagHandlers` to the `<Search />` component. `tagHandlers` should be an object with the attribute names matching the fields to process and the values being function to generate a tag. 

```jsx
const tagHandlers = {
    '#myFieldName': (tag, field, formSchema, formData) => (tag),
    'Text': (tag, field, formSchema, formData) => (tag),
};

return <Search {...props} tagHandlers={tagHandlers} />
```

`tagHandlers['#myFieldName']` will match only the field that uses the name `myFieldName`. `tagHandlers['Text']` will match any field that has a schema type of `Text`.

Each tag handler will receive 4 arguments:

* `tag` provide raw tag data. It will contain `key`, `label` and `value` attributes.
* `field` provides a representation of the field contain in the redux-form schema.
* `formSchema` is the redux-form schema for the current form.
* `formData` is the data for the current redux-form.

If the tag handler returns `false`, no tag will be generated for this field. Otherwise an `enrichedTag` object should be returned with the following attributes.

* `key`: unique identifier for the field (mandatory),
* `label`: string to display in the tag (defaults to `key` if not provided),
* `value`: the value to attach to the tag. It can be left `undefined` if the tag should be valueless.
* `focusSelector`: selector used to identified the form field that should be focus on when the user clicks the tag. If left `undefined`, they `key` will be used to build the selector.
* `linkedFields`: An array of formData keys that should be cleared when the tag is dismissed. If not provided, `key` will be used to determined which attribute should be cleared from formData.
