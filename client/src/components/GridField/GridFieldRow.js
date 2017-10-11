import React from 'react';

const GridFieldRow = (props) => {
  const className = `grid-field__row ${props.className}`;
  return <tr tabIndex={0} className={className}>{props.children}</tr>;
};

export default GridFieldRow;
