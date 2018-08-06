import React, {PropTypes} from 'react';
import Tag from './Tag';
import classnames from 'classnames';
import i18n from 'i18n';

const TagList = ({tags, deletable}) => (
  <div className="TagList">
    { tags.map( (props) => (
      <Tag deletable={deletable} dataKey={props.key} {...props} />
    ))}
  </div>
);

TagList.propTypes = {
  onTagClick: PropTypes.func,
  onTagDelete: PropTypes.func,
  deletable: PropTypes.bool,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.required,
      label: PropTypes.string,
      value: PropTypes.string,
    })
  )
};

TagList.defaultProps = {
  deletable: false
};

export default TagList;
