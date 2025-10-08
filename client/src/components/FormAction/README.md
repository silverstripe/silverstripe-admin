# FormAction Component

Used for form actions. For example a submit button.

## Properties

 * `handleClick` (function): The handler for when a button is clicked
 * `label` (string): The text to display on the button.
 * `id` (string): The html id attribute.
 * `type` (string): Used for the button's `type` attribute. Defaults to `button`
 * `bootstrapButtonStyle` (string): The style of button to be shown, adds a class `btn-{style}` to the button. Defaults to `secondary`. Recommended values are:
   * 'primary'
   * 'outline-secondary'
   * 'secondary'
   * 'outline-secondary'
   * 'link'
   * 'danger'
 * `icon` (string): The icon to be used on the button, adds `font-icon-{icon}` class to a child element in the button. See available icons [here](../../font/icons-reference.html).
 * `loading` (boolean): If true, replaces the text/icon with a loading icon.
 * `disabled` (boolean): If true, gives the button a visually disabled state and disables click events.
 * `readOnly` (boolean): If true, will also cause the button to be disabled.
 * `extraClass` (string): Add extra custom classes.

See the pattern library for examples.
