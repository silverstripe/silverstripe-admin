import React, { PropTypes } from 'react';
import i18n from 'i18n';
import classnames from 'classnames';
import FormAlert from 'components/FormAlert/FormAlert';

const NotFoundComponent = ({ itemName, name, value }) => (
  <div className={classnames(itemName, 'not-found-component')}>
    <FormAlert value={i18n.inject(
      i18n._t(
        'Admin.NOT_FOUND_COMPONENT',
        'The component here ({component}) failed to load, there is a chance that you may lose data when saving due to this.'
      ),
      { component: itemName }
    )}
    />
    {(name && typeof value === 'string')
      ? <input type="hidden" name={name} value={value} />
      : null
    }
  </div>
);

NotFoundComponent.propTypes = {
  itemName: PropTypes.string.isRequired,
  name: PropTypes.string,
  value: PropTypes.any,
};

export default NotFoundComponent;
