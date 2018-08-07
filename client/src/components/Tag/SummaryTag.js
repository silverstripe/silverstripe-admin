import React, {PropTypes} from 'react';
import Tag from './Tag';
import classnames from 'classnames';
import i18n from 'i18n';

const SummaryTag = ({label, count, ...props}) => (
  <Tag {...props} deletable={false} title={`${count} ${label}`}>
    { count } <span className="font-icon-sliders" aria-label={label} />
  </Tag>
);

SummaryTag.propTypes = Object.assign({}, Tag.propTypes, {
  label: PropTypes.string,
  count: PropTypes.number
});

SummaryTag.defaultProps = {
  label: i18n._t('Admin.SUMMARY_TAG_LABEL', 'filters')
};

export default SummaryTag;
