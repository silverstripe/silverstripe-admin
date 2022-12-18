# PopoverOptionSet Component

Generates a popover filled with buttons that can be filtered with a search.

This component can be viewed in the bundled pattern library

Additionally a toggle component is provided as a basic implementation or example to get started.

### Example
```js
const buttons = [
  {
    content: 'Button A',
    key: 'A'
  },
  {
    content: 'Button B',
    key: 'B'
  },
  {
    content: 'Button C',
    key: 'C'
  }
];

const { isOpen } = state;

// Example code - setting state should not be done in render
const toggle = () => {
  // Force setting state to the end of the execution queue to clear a potential race condition
  // with entwine click handlers
  window.setTimeout(() => this.setState({ isOpen: !this.state.isOpen }), 0);
};

return (
  <PopoverOptionSet
    buttons={buttons}
    target="someButtonID"
    isOpen={isOpen}
    toggle={toggle}
    provideButtonClickHandler={button => event => { console.log('Clicked button:', button) }}
  />
);
```

### PopoverOptionSet PropTypes

Many of the proptypes of this component are forwarded onto a [Reactstrap Popover component](https://reactstrap.github.io/components/popovers/)

```
// Buttons to be shown in the popover
buttons: PropTypes.arrayOf(PropTypes.shape({
  // Unique key for this button
  key: PropTypes.string.isRequired,
  // String (or JSX) for the content of the button
  content: PropTypes.node.isRequired,
  // An event handler that is fired when the button is clicked
  onClick: PropTypes.func.isRequired,
  // Classnames to be applied to the button
  className: PropTypes.oneOfType(PropTypes.string,
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  // Additional props to be given to the button
  buttonProps: PropTypes.object,
})).isRequired,

// Accepts a function that takes a search term as a first parameter and a set of buttons to match against.
// Buttons are provided as they are given meaning you can provide additional button attributes to the "buttons" prop
// and these attributes will be available for filtering against
// Returns a filtered set of buttons
// Default search handler assumes button content to be plain text and performs a simple string.contains check.
onSearch: PropTypes.func,

// The container to render the popover within. See the ReactStrap documentation for popovers
container: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),

// Whether the popover is open. See the ReactStrap documentation for popovers
// A component that controls this prop with state is available (see below)
isOpen: PropTypes.bool.isRequired,

// Placement of the popover when it is opened. See the ReactStrap documentation for popovers
placement: PropTypes.string,

// The ID of the DOMElement used to toggle this popoever. See the ReactStrap documentation for popover
// A component that provides this prop is available (see below)
target: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]).isRequired,

// A function that toggles this visibility of the popover. See the ReactStrap documentation for popover
// This is NOT required for Reactstrap but IS required for this component as accessibility helpers are provided to close
// the popover within this component
toggle: PropTypes.func.isRequired,

// An optional placeholder for the search field
searchPlaceholder: PropTypes.string,

// Optionally disable the search field from appearing
disableSearch: PropTypes.bool,

// The component to use for each button - defaults to a Reactstrap button component
ButtonComponent: PropTypes.elementType,

// Various classNames that can be configured
// NOTE that styles are applied to the defaults for these props. If you are not intending to add your own styles then 
// you MUST include the default values in your new props.
// The values provided to these props is passed through the classnames helper function
className: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
searchClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
searchInputClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
clearButtonClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
buttonContainerClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
emptyResultClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
buttonClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
```

## PopoverOptionSetToggle

This component is provided to get started with a PopoverOptionSet

### Example

```js
const buttons = [
  {
    content: 'Button A',
    key: 'A'
  },
  {
    content: 'Button B',
    key: 'B'
  },
  {
    content: 'Button C',
    key: 'C'
  }
];

<PopoverOptionSetToggle
  buttons={buttons}
  provideButtonClickHandler={button => event => { console.log('Clicked button:', button) }}
  id="Sample"
/>
```
