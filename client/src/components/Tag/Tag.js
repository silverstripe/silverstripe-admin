import React, {PropTypes} from 'react';
import { Button } from 'reactstrap';
import classnames from 'classnames';
import i18n from 'i18n';

const Tag = ({onClick, onDelete, deletable, key, label, ...props}) => (
  <Button
    {...props}
    className={ classnames("Tag", {"Tag__deletable": deletable}) }
    onClick={(e) => { e.stopPropagation(); onClick(key); } }
    href="#">
    {deletable && <Delete onDelete={onDelete} key={key} />}
    {label}
  </Button>
);

const Delete = ({key, onDelete}) => (
  <Button
    onClick={ (e) => { e.stopPropagation(); onDelete(key); } }
    aria-label={i18n._t('Admin.REMOVE_TAG', 'Remove Tag')}
    className="Tag__Delete font-icon-cancel btn--no-text btn--icon-sm"
  />
);


Tag.propTypes = {
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  deletable: PropTypes.bool,
  key: PropTypes.string,
  label: PropTypes.string,
};

Tag.defaultProps = {
  deletable: false,
  onClick: () => {},
  onDelete: () => {},
};

export default Tag;
