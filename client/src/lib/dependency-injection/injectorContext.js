import { PropTypes } from 'react';

export default {
  injector: PropTypes.shape({
    get: PropTypes.func,
    context: PropTypes.string,
    validate: PropTypes.func,
  }),
};
