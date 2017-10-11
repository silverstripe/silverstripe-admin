import React from 'react';

const Accordion = (props) => (
  <div
    className="accordion"
    role="tablist"
    aria-multiselectable="true"
  >
    {props.children}
  </div>
);

export default Accordion;
