# FormAlert Component

Generates a bootstrap alert box, with state closing handled optionally.

## Example

```js
<FormAlert type="error" value="There was a problem" />
```

As a dismissible alert:

```js
<FormAlert type="success" value="Everything worked fine!" closeLabel="close" />
```

## Properties

 * `extraClass` (string): Extra classes the component should have.
 * `value` (any): The content to show.
 * `type` (string): The kind of alert box to show, defines appearance, accepts the following:
   * success
   * warning
   * danger
   * info
 * `onClosed` (function): For manual handling of showing and hiding the message, used in conjunction with `visible`.
 * `visible` (boolean): Manual set whether the message is hidden or shown.
 * `closeLabel` (string): The label for the screen reader close button. Providing a value for this will make the
   alert "dismissible."


 _NOTE:_ For other properties, please refer to the [reactstrap Alert](https://reactstrap.github.io/components/alerts/) documentation.
