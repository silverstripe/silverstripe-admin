import { Component } from 'react';

let warned = false;
let timer = null;
class SilverStripeComponent extends Component {
  constructor() {
    super();
    clearTimeout(timer);
    if (!warned && process.env.NODE_ENV !== 'production') {
      timer = setTimeout(() => {
        // eslint-disable-next-line no-console
        console.warn('SilverStripeComponent will be removed');
        warned = true;
      });
    }
  }

  render() {
    return null;
  }
}

SilverStripeComponent.propTypes = {};

export default SilverStripeComponent;
