# DateTimeField Component

Generates an editable date time field.

## Example

```js
<DateTimeField name="my-text" />
```


## Properties

 * `id` (string): The ID for the component.
 * `extraClass` (string): Extra classes the component should have.
 * `name` (string) (required): The name for the component.
 * `onChange` (function): Event handler for when the component changes.
 * `value` (string): The value to display for the field - localised date time format or ISO 8601 date format
 * `readOnly` (boolean): Whether this field is read only.
 * `disabled` (boolean): Whether this field is disabled.
 * `lang` (string): Locale string. E.g. `en_NZ`.

 _NOTE:_ For other properties, please refer to the [reactstrap FormControl](https://reactstrap.github.io/components/form/) documentation.
