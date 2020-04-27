# Button Component

The Button wraps a regular [Reactstrap Button](https://reactstrap.github.io/components/buttons/) component with a few Silverstripe-specific convenience props. All the regular Reactstrap props are also available.

## Example
```js
const props = {
  color: 'primary',
  size: 'md',
  icon: 'search',
  outline: false,
  block: false,
  active: false,
  disabled: false,
  noText: false, 
  onClick: console.dir,
  className: 'action__result',
};

<Button {...props}>Some Text</Button>
```

## Properties

 * `icon` (string): A valid icon name to display in the button.
 * `noText` (boolean): Hide the button text and display it as an `aria-label` instead. This should be use in conjunction with `icon` otherise your button will be empty.
 
### Regular Reactstrap properties

 * `color` (string): Predefined style to apply to the button.
 * `size` (string): Make the button smaller or larger. Acceptable values include `sm`, `md` and `lg`.
 * `outline` (boolean): Render the button border with a transparent background.
 * `block` (boolean): Display the button as a block taking the full width of its container.
 * `active` (boolean): Render the button in an active state. Useful for toggle buttons.
 * `disabled` (boolean): Prevent the user from interacting with the button.
 
# BackButton Component

Generic Button component to allow users to return to a preview view. It displays a `<` icon and has an appropriate `aria-label`. 

## Example
```js
const props = {
  onClick: console.dir,
  className: 'action__result',
};

<BackButton {...props} />
```

## Properties

 * `children` (string): If present, any nested content inside the button will apply to the `aria-label` attribute. Otherwise, the localised string 'Back' will be used.
