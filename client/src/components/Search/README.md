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

## Properties
* onSearch (func): Method to execute when performing a search.
* onClear (func): Method to execute when the clear action is performed.
* onHide (func): Method to execute when the Search self-hides. You only need to specify this if you're using an external mechanism to toggle the search.  
* id (string): Unique identifier.
* display (string): Controls whatever the display of the search component. Possible values are `NONE`, `VISIBLE`, `EXPANDED`. `NONE` will display a search toggle if `displayBeahvior` is set to `TOGGLABLE`. Otherwise nothing will be rendered.
* displayBehavior (string): Controls how the user can interact with the display of the component. `TOGGLABLE` allows the user to hide and show the component. `HIDEABLE` allows the user to hide the component. `NONE` prevents the user for directly affecting the component's visibility. 
* formSchemaUrl (string): URL to the form schema to use for the filter form.
* filters (object): Submitted data, if any. 
* formData (object): Data to pre-populate the form with.
* placeholder (string): Placeholder for the form field. 
* term (string): Can be use to explicitly define what the current search term is.
* forceFilters (bool): Force the rendering of the advanced filters. (For demoing purpose)
