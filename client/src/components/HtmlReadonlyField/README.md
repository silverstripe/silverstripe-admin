# HtmlReadonlyField Component

Generates a block of raw HTML content inside a Readonly styled box.

## Example
```js
<HtmlReadonlyField name="my-raw-content" value="<a href="/">My link in <b>a box</b></a>" />
```

## Properties

 * `id` (string): The ID for the component.
 * `extraClass` (string): Extra classes the component should have.
 * `name` (string) (required): The name for the component.
 * `value` (string): The raw HTML content to generate.
 
 _NOTE:_ For other properties, please refer to the [reactstrap Input](https://reactstrap.github.io/components/form/) documentation.
