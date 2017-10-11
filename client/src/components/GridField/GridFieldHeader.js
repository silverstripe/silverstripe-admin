import React from 'react';
import GridFieldRow from './GridFieldRow';

const GridFieldHeader = (props) => (
  <GridFieldRow>{props.children}</GridFieldRow>
);

export default GridFieldHeader;
