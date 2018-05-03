# Loading

Provides a simple SilverStripe loading indicator component.

## Properties

 * `containerClass` (string): HTML classes to be added to the indicator's container div. If empty, no container will
   be rendered. Default: `flexbox-area-grow`.

## Example

```js
render() {
  const { loading } = this.props;
  
  if (loading) {
    return <Loading />;
  }
  
  return <MyContent />;
}
```
