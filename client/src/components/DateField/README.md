# DateField Component

Generates an editable date field.

## Example

```js
<DateField name="my-text" />
```


## Properties

 * `id` (string): The ID for the component.
 * `extraClass` (string): Extra classes the component should have.
 * `name` (string) (required): The name for the component.
 * `onChange` (function): Event handler for when the component changes.
 * `value` (string): The value to display for the field - localised date format or ISO 8601 date format
 * `readOnly` (boolean): Whether this field is read only.
 * `disabled` (boolean): Whether this field is disabled.
 * `lang` (string): Locale string. E.g. `en_NZ`.

 _NOTE:_ For other properties, please refer to the [react-bootstrap FormControl](https://react-bootstrap.github.io/components.html#forms-props-form-control) documentation.
