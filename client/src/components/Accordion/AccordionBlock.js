import React from 'react';

const AccordionBlock = (props) => {
  const headerID = `${props.groupid}_Header`;
  const listID = `${props.groupid}_Items`;
  const listIDAttr = listID.replace(/\\/g, '_');
  const headerIDAttr = headerID.replace(/\\/g, '_');

  const groupProps = {
    id: listIDAttr,
    'aria-expanded': true,
    className: 'list-group list-group-flush collapse show',
    role: 'tabpanel',
    'aria-labelledby': headerID,
  };
  // Note the `font-icon-` css class on the icon is necessary.
  // The actual icon itself is chosen through CSS based on whether the accordion is collapsed or not.
  return (
    <div className="accordion__block">
      <a
        className="accordion__title"
        data-bs-toggle="collapse"
        href={`#${listIDAttr}`}
        aria-expanded="true"
        aria-controls={listID}
        id={headerIDAttr}
        role="tab"
      >
        <span className="accordion__arrow-icon font-icon-" aria-hidden="true" />
        {props.title}
      </a>
      <div {...groupProps}>
        {props.children}
      </div>
    </div>
  );
};

export default AccordionBlock;
