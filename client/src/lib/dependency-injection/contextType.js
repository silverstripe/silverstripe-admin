import PropTypes from 'prop-types';

// TODO: changelog entry about filename change

export default {
  injector: PropTypes.shape({
    get: PropTypes.func,
    context: PropTypes.string,
    validate: PropTypes.func,
  }),
};
