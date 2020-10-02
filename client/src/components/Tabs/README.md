# Tabs Component

For separating content into tabs without the need for separate pages.

This extends from `reactstrap` with similar expected behaviours, only difference is that when
there is only one tab (or none) in the Tabset, then only the content will show without the
clickable tab.

## Example

```js
<Tabs defaultActiveKey="Main" id="Root">
    <TabItem name="Main" title="Main">
        My first tab content
    </TabItem>
    <TabItem name="Settings" title="Settings">
        My settings tab here
    </TabItem>
</Tabs>
```

## Tabs Properties

 * `id` (string) (required): The ID for the component.
 * `extraClass` (string): Extra classes the component should have.
 * `defaultActiveKey` (string): The default tab to open, should match the name of a child `TabItem`, will default to the first Tab child.

## TabItem Properties

 * `name` (string) (required): A key to match the `activeKey` or `defaultActiveKey` property in the `Tabs` component to show the content. This replaces the `eventKey` property.
 * `title` (string): The label to display for the tab, can be set `null` to hide the tab.
 * `extraClass` (string): Extra classes the component should have.
 * `tabClassName` (string): Class to use for the tab.

 _NOTE:_ For other properties, please refer to the [reactstrap Tabs](https://reactstrap.github.io/components/tabs/) documentation.

# Interacting with Tabs from a child component

Components inside a tab can retrieve information about their parent using these method:
- `useTabContext` which is a hook returning the tab context for functional components
- `injectTabContext` which injects the tab context as props in your class component
- `useTabFirstShow` which is a hook that allows you to execute a callback when a tab is first shown.

The `tabContext` returned by `useTabContext` and `injectTabContext` contains the following properties
- `activeTab` (string): name of the active tab in the nearest tab set
- `currentTab` (string): name of the tab the current component resides in
- `isOnActiveTab` (boolean): whether the current component is in a tab that is currently visible.

The `tabContext` will be `false` for components outside of a tab.
 

## Example of `useTabContext`

```jsx
import React from 'react';
import useTabContext from 'hooks/useTabContext';

export function MyComponent() {
  // useTabContext only works inside functional components
  const tabContext = useTabContext();
  if (!tabContext) {
    return <p>I'm not in a tab.</p>;
  }

  const { activeTab, currentTab, isOnActiveTab } = tabContext;
  
  return (
    <p>
        The {activeTab} tab is currently active.
        I'm on the {currentTab} tab which is {isOnActiveTab ? 'visible' : 'invisible'}.
    </p>
  ); 
}
```

## Example of `injectTabContext`

```jsx
import React, { Component } from 'react';
import { injectTabContext } from 'hooks/useTabContext';

class MyComponent extends Component {
  render() {  
    const { tabContext } = this.props;

    if (!tabContext) {
      return <p>I'm not in a tab.</p>;
    }
    
    const { activeTab, currentTab, isOnActiveTab } = tabContext;
      
    return (
      <p>
        The {activeTab} tab is currently active.
        I'm on the {currentTab} tab which is {isOnActiveTab ? 'visible' : 'invisible'}.
      </p>
    );
  }
}

// `injectTabContext` is a higher-order-component (HOC). It is used to add context to class 
// components. It can also be used on functional components.
export default injectTabContext(MyComponent);
```

## Example of `useTabFirstShow`

```jsx
import React from 'react';
import { useTabFirstShow } from 'hooks/useTabContext';

export function MyComponent({ loadDataCallback }) {
  // `useTabFirstShow` is a Silverstripe specific hook. It will triger the provided function once 
  // the component is visible. The tabContext is passed back to the provided method.
  // `useTabFirstShow` can be useful to delay an expensive request until it's actually needed.
  // Because `useTabFirstShow` is a hook, it can only be called from a functional component.
  // Use `injectTabContext` and lifecycle methods to achieve the same result in a class component.
  useTabFirstShow(loadDataCallback);
  
  return <p>I'll wait until the user looks at me to fetch data.</p>;
}
```
