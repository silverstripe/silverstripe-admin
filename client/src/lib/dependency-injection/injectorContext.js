import PropTypes from 'prop-types';

export default {
  injector: PropTypes.shape({
    get: PropTypes.func,
    context: PropTypes.string,
    validate: PropTypes.func,
  }),
};
