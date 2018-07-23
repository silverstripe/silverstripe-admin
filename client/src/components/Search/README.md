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
* forceFilters (bool): Force the rendering of the advanced filters. (For demoing purpose)
* formData (object): Data to pre-populate the form with.
* formSchemaUrl (string): URL to the form schema to use for the filter form.
* id (string): Unique identifier.
* id (string): Form identifier pass to the underlying form builder. Defaults to `Admin.SearchForm`.
* name (string): Name that will be applied to the search input. This controls the attribute the search term will be attached to when `onSearch` is called. Defaults to `searchTerm`.
* placeholder (string): Placeholder for the form field. 
* term (string): Can be use to explicitly define what the current search term is.
