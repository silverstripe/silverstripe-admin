/* global document */
import React from 'react';

import content from '../icons-reference.html';

/**
 * Config for grouping icons into different sections of the story
 */
const groups = [
  {
    title: 'Page icons',
    selectors: ['[class*=font-icon-p-]', '[class*=font-icon-page]'],
  },
  {
    title: 'Block icons',
    selectors: ['[class*=font-icon-block-]'],
  },
  {
    title: 'Other icons',
    selectors: ['.icon'],
  },
];

const shadow = document.createElement('html');
shadow.innerHTML = content;

const mapping = shadow.querySelector('.css-mapping');
Array.prototype.slice
  .call(mapping.querySelectorAll('input'))
  .forEach((input) => input.classList.add('form-control'));

// Traverse over the groups config to split up the story into sections
groups.reverse().forEach(({ title, selectors, summary }) => {
  // Match all the relevant icons and bring them to the front
  Array.prototype.slice
    .call(mapping.querySelectorAll(selectors.join(',')))
    .forEach((div) => {
      mapping.prepend(div.parentElement);
    });

  // Create a heading element for the section of the story
  const headingWrapper = document.createElement('li');
  headingWrapper.classList.add('css-mapping__header');
  const heading = document.createElement('h2');
  heading.appendChild(document.createTextNode(title));
  headingWrapper.appendChild(heading);

  // Add summary to the heading wrapper if it exists in the config
  if (summary) {
    const summaryNode = document.createElement('p');
    summaryNode.appendChild(document.createTextNode(summary));
    headingWrapper.appendChild(summaryNode);
  }

  // Add header for each section
  mapping.prepend(headingWrapper);
});

const styles = `
  /* styles that help style the borrowed HTML */
  .css-mapping {
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
  }
  .css-mapping .icon {
    text-indent: 0;
    display: inline-block;
    font-size: 25px;
    margin-right: 5px;
  }
  .css-mapping .icon:before {
    vertical-align: middle;
  }
  .css-mapping li {
    list-style: none;
    padding: 15px;
    margin: 0;
    display: flex;
    max-width: 250px;
  }
  .css-mapping .form-control {
    flex: 1;
  }

  .css-mapping .css-mapping__header {
    border-bottom: 1px solid #aebace; /* $gray-300 */
    display: block;
    max-width: none;
    margin: 25px 15px 15px;
    padding: 0;
    width: 100%;
  }
`;

export default {
  title: 'Admin/Icons',
};

export const IconReference = () => (
  <div>
    <style>{styles}</style>
    {/* eslint-disable-next-line react/no-danger */}
    <div dangerouslySetInnerHTML={{ __html: mapping.outerHTML }} />
  </div>
);
