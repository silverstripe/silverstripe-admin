# TreeDropdownField

A complex select field that binds to an API to allow progressive fetching of nested items. `TreeDropdownField` was
originally developed for use with `SiteTree` and `Folder` objects, but can be used with any `DataObject` that has the
`Hierarchy` extension applied.

This React component also powers the PHP API's `TreeMultiselectField`, allowing multiple items to be selected, by
setting `multi: true`.

A Redux store with `TreeDropdownFieldReducer` installed must be provided as context if the component is used outside
the CMS. This is used to store the API responses and general state of each `TreeDropdownField` instance. You can open
the Redux Devtools panel to observe the actions and state used by the component.
