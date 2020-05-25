/* global jest, describe, beforeEach, it, expect */

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import FileStatusIcon from '../FileStatusIcon';

describe('FileStatusIcon', () => {
  let props = null;

  beforeEach(() => {
    props = {
      fileID: 123,
      // <Tooltip> needs to be disabled in a jest context
      // seems to need a real DOM to render into rather than a test-DOM
      disableTooltip: true
    };
  });

  const buildComponent = (fnProps) => {
    const fileStatusIcon = ReactTestUtils.renderIntoDocument(<FileStatusIcon {...fnProps} />);
    return fileStatusIcon;
  };

  const getContainer = (fileStatusIcon) => {
    const divs = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      fileStatusIcon,
      'file-status-icon'
    );
    return divs[0];
  };

  const getSpan = (fileStatusIcon) => {
    const spans = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      fileStatusIcon,
      'file-status-icon__icon'
    );
    return spans[0];
  };

  describe('render()', () => {
    let fileStatusIcon = null;

    it('shows the restricted access icon', () => {
      fileStatusIcon = buildComponent({
        hasRestrictedAccess: true,
        ...props
      });
      const span = getSpan(fileStatusIcon);
      expect(span.classList).toContain('font-icon-user-lock');
    });

    it('shows the form submission icon if access restricted', () => {
      fileStatusIcon = buildComponent({
        isTrackedFormUpload: true,
        hasRestrictedAccess: true,
        ...props
      });
      const span = getSpan(fileStatusIcon);
      expect(span.classList).toContain('font-icon-address-card');
    });

    it('shows the form submission alert icon if access unrestricted', () => {
      fileStatusIcon = buildComponent({
        isTrackedFormUpload: true,
        hasRestrictedAccess: false,
        ...props
      });
      const span = getSpan(fileStatusIcon);
      expect(span.classList).toContain('font-icon-address-card-warning');
    });

    it('can add an extraClassName to the container', () => {
      fileStatusIcon = buildComponent({
        hasRestrictedAccess: true,
        extraClassName: 'myclassname',
        ...props
      });
      const div = getContainer(fileStatusIcon);
      expect(div.classList).toContain('myclassname');
    });

    it('has no background by default or it has have one added', () => {
      fileStatusIcon = buildComponent({
        hasRestrictedAccess: true,
        ...props
      });
      let div = getContainer(fileStatusIcon);
      expect(div.classList).not.toContain('file-status-icon--background');

      fileStatusIcon = buildComponent({
        hasRestrictedAccess: true,
        includeBackground: true,
        ...props
      });
      div = getContainer(fileStatusIcon);
      expect(div.classList).toContain('file-status-icon--background');
    });
  });
});
