# PopoverField Component

Creates a popup box that may contain other nested fields. The activator for this popup
is represented by a button.

## Example
```js
<PopoverField>
  <button>My first button</button>
  <button>My other button</button>
</PopoverField>
```

## Properties

 * `id` (string): The ID for the component.
 * `title` (any): The title to display on the button to open the popover, if left blank it will display an ellipsis icon.
 * `className` (string): A class name that is applied to the container div and the trigger button.
 * `buttonClassName` (string): A class name that is applied to the trigger button.
 * `popoverClassName` (string): A class name that is applied to the popover element.
 * `data` (object) (required): Extra data that helps define this field uniquely.
   * `popoverTitle` (string): The title to appear for the popover.
   * `buttonTooltip` (string): Title for button tooltip.
   * `placement` (string): Where the popover will appear in relation to the button, options available are:
     * top
     * right
     * bottom
     * left
 * `toggleCallback` (function): An optional callback for when the popover is toggled.
