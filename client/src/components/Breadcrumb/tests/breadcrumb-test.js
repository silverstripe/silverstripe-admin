/* global jest, describe, beforeEach, it, expect */

jest.unmock('../Breadcrumb');

// FYI: Changing these to import statements broke jest's automocking
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Component as Breadcrumb } from '../Breadcrumb';

describe('BreadcrumbsComponent', () => {
  let props = null;

  beforeEach(() => {
    props = {};
  });

  describe('renderBreadcrumbs()', () => {
    let breadcrumbs = null;

    it('should convert the props.crumbs array into jsx to be rendered', () => {
      props.crumbs = [
        { text: 'breadcrumb1', href: 'href1' },
        { text: 'breadcrumb2', href: 'href2' },
        { text: 'breadcrumb3',
          href: 'href3',
          icon: {
            className: 'breadcrumb3icon',
            onClick: jest.fn(),
          },
        },
      ];

      breadcrumbs = ReactTestUtils.renderIntoDocument(
        <Breadcrumb {...props} />
      );

      const links = ReactTestUtils.scryRenderedDOMComponentsWithClass(
        breadcrumbs,
        'breadcrumb__item-title'
      );
      expect(links[0].textContent).toBe('breadcrumb1');
      expect(links[1].textContent).toBe('breadcrumb2');
      expect(links[2].textContent).toBe('breadcrumb3');
      expect(links[2].parentElement.classList).toContain('breadcrumb__item--last');

      const lastLinkIcon = ReactTestUtils.scryRenderedDOMComponentsWithClass(
        breadcrumbs,
        'breadcrumb3icon'
      );
      expect(lastLinkIcon).toBeTruthy();
    });

    it('should return null if props.crumbs is not set', () => {
      breadcrumbs = ReactTestUtils.renderIntoDocument(
        <Breadcrumb {...props} />
      );

      const listEls = breadcrumbs.renderBreadcrumbs();
      expect(listEls).toBe(null);
    });
  });
});
