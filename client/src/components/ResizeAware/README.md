# ResizeAware component

`<ResizeAware />` can be wrapped around another component and will fire an event when the size of the child component changes. The API was adapted from the [ResizeAware](https://github.com/FezVrasta/react-resize-aware) library by Federico Zivolo. 

## Example

```jsx
<ResizeAware onResize={onResize}>
    <div>Something of variable size.</div>
</ResizeAware>
```
## Handlers

* `onResize: (size: {width: number, height: number}) => void` Fired when the component size changes.

## Properties

* `component: string|function` Optional property to specify what component the ResizeAware wrapper should use to contain the child. Defaults to `<div>`.
