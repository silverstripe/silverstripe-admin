# TimeField Component

Generates an editable time field.

## Example

```js
<TimeField name="my-text" />
```


## Properties

 * `id` (string): The ID for the component.
 * `extraClass` (string): Extra classes the component should have.
 * `name` (string) (required): The name for the component.
 * `onChange` (function): Event handler for when the component changes.
 * `value` (string): The value to display for the field - expects time ISO 8601 time format.
 * `readOnly` (boolean): Whether this field is read only.
 * `disabled` (boolean): Whether this field is disabled.
 * `type` (string): Defines the type this component will have, e.g. `email`, `tel`.

 _NOTE:_ For other properties, please refer to the [reactstrap Input](https://reactstrap.github.io/components/form/) documentation.
