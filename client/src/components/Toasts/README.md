## Toast notifications

Toast notifications should be used to notify the user that their action has altered the state of the application. They are rendered as temporary messages in the top right corner of the Admin UI. A toast notification may have 1 or 2 _actions_ attached to it.

Use the provided toast Redux actions to push a new toast notification into the Redux store. Alternatively, you can use the `jQuery.noticeAdd` to display a toast notification in legacy Entwine-based contexts.

### Usage guideline 

By default, toast notifications are ephemeral. They should occur in response to a user action and communicate short, non-critical messages, such as confirming the success of an operation.

Do not use them to display critical information that requires immediate action from the user, such as validation errors. Consider using form alerts or modal alerts instead.

For notifications with a moderate importance (e.g.: warning and non-critical errors), consider disabling the toast notification timeout by setting the `stay` attribute to `true`.

If you attach actions to a toast notification, those should be shortcuts to a natural next step and an alternative way of performing that task should be available. e.g.: A toast confirming the publication of a page could offer an action to "View live page". 

### Creating a toast notification in a React context

This is the best way to display a new toast notification. Import the `toastsActions` and use Redux's `connect` method to inject them in your component.

The primary action is called `display` and accepts an object containing these attributes:
- `{string} text` message to display in the toast.
- `{string} type` used to apply appropriate styling to the toast. Acceptable values are `info`, `warning`, `success`, `error`. The default value is `info`.
- `{boolean} stay` keeps the toast notification on screen until manually dismissed by the user when set to `true`. Default value is `false`.
- `{string} id` a unique identifier for the toast. This is only useful if you intend to interact with the toast later on. Otherwise, leave out the value and it will be automatically generated for you.
- `{Object[]} actions` allows you to attach one or two buttons to the toast notification. Actions should be provided as an array of object with the following properties:
  - `{string} label` text to attach to the button.
  - `{string} href` a URL where the user will be taken to after clicking the button.
  - `{function} onClick` a callback that will be fired when the user clicks the button. This can not be used if an `href` is provided.
  
Four "shorthand" actions are also provided. They simply wrap around the `display` action and allow you to quickly create a toast notification of a given type. They accept a single parameter to specify the message to display in the toast. The shorthand actions are:
- `info`
- `success`
- `warning`
- `error`

`warning` and `error` produce toast notifications without a timeout that need to be manually dismissed by the user

#### Example usage with redux actions
```jsx
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as toastsActions from 'state/toasts/ToastsActions';
import Button from 'components/Button/Button';

const Component = ({ actions: { display, success, warning, info, error } }) => (
  <div>
    <Button onClick={() => success('Congratulations')}>Click me</Button>
    <Button onClick={() => warning('Be careful')}>Click me</Button>
    <Button onClick={() => info('Keep this in mind')}>Click me</Button>
    <Button onClick={() => error('I am so sorry')}>Click me</Button>

    <Button onClick={() => display({
      text: 'Look at my action',
      type: 'warning',
      actions: [{ label: 'Say something', onClick: () => alert('something') }]
    })}>Click me</Button>

  </div>
);

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(toastsActions, dispatch)
});

export default connect(() => ({}), mapDispatchToProps)(Component);

```

### Creating a toast notification in a jQuery/Entwine context

If your CMS feature still uses jQuery/Entwine, you can use the `jQuery.noticeAdd()` method to display a push notification. `noticeAdd()` expects the same arguments as the `display()` Redux action.

### Additional Redux actions

Three other Redux actions are available. These are used internally by the `<ToastContainer />` to manage its state, but can be use by other components as well:

- `dismiss()` will immediately remove a toast notification. It expects the `id` of the toast to remove.
- `pause()` halts the auto-dismissal timeout for all active toasts. The user can still manually dismiss toasts.
- `resume()` resets and resumes the timeout for all active toasts.

## Toast components

**Note:** You shouldn't need to use the `<Toast />` and `<Toasts />` components directly to display Toast notifications. This section is provided for completeness.

### `<Toast />`

Renders a single toast notification.

```jsx
<Toast
  actions={[{label: 'Click me', onClick: () => {}}]}
  dismissed={false}
  onDismiss={ () => {} }
  text="The quick brown fox jumps over the lazy dog"
  type="info"
/>
```
#### Handlers

* `{function} onDismiss` callback for when the toast is dismissed.

#### Properties

* `{Object[]} actions` list of actions to attach to the toast. Action beyond the first two are ignored.
* `{boolean} dismissed` whether the toast has been dismissed. Setting this to `true` triggers a fade out.
* `{string} text` message to display in the toast. Does NOT accept HTML string.
* `{string} type` style to apply to the toast.

### `<Toasts />`

Renders a list of toast notifications.

```jsx
<Toasts
  onDismiss={onDismiss}
  onPause={onPause}
  onResume={onResume}
  toasts={[
    {
      dismissed: false,
      id: 'one',
      text: 'Notice me',
      type: 'notice'
    }
  ]}
/>
/>
```
#### Handlers

* `{function} onDismiss` callback for when a toast is dismissed. The unique identifier of the dismissed toast is passed to the callback.
* `{function} onPause` callback to pause the auto-dismissal of toasts. This gets triggered by the `onMouseEnter` and `onFocus` events.
* `{function} onResume` callback to resume the auto-dismissal of toasts. This gets triggered by the `onMouseLeave` and `onBlur` events

#### Properties

* `{Object[]} toasts` list of toasts to display.
