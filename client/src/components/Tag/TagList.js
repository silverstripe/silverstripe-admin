import React, {PropTypes} from 'react';
import Tag from './Tag';
import classnames from 'classnames';
import i18n from 'i18n';

const TagList = ({tags, deletable, focusable}) => (
  <div className="TagList">
    { tags.map( (props) => (
      <Tag {...props}
        deletable={deletable}
        dataKey={props.key}
        focusable={focusable} />
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
  ),
  focusable: PropTypes.bool,
};

TagList.defaultProps = {
  deletable: false,
  focusable: true,
};

export default TagList;
