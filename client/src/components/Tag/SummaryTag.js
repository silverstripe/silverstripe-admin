import React from 'react';
import Tag from 'components/Tag/Tag';
import i18n from 'i18n';
import PropTypes from 'prop-types';

/**
 * Display a tag with a *filter* icons and a number to summarise a greater number of other tags.
 */
const SummaryTag = ({ label, count, ...props }) => (
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
