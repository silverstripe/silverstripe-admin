/* global document */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';

import content from '../icons-reference.html';

const shadow = document.createElement('html');
shadow.innerHTML = content;

const mapping = shadow.querySelector('.css-mapping');
Array.prototype.slice.call(mapping.querySelectorAll('input')).forEach((input) => input.classList.add('form-control'));

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
`;

/* eslint-disable react/no-danger */
storiesOf('Admin/Icons', module)
  .add('Icon reference', () => (
    <div>
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: mapping.outerHTML }} />
    </div>
  ));
