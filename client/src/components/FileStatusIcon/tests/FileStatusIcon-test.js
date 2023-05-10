/* global jest, test, describe, beforeEach, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import FileStatusIcon from '../FileStatusIcon';

test('FileStatusIcon.render() shows the restricted access icon', () => {
  const { container } = render(
    <FileStatusIcon {...{
      hasRestrictedAccess: true
    }}
    />
  );
  expect(container.querySelector('.font-icon-user-lock')).not.toBe(null);
});

test('FileStatusIcon.render() shows the form submission icon if access restricted', () => {
  const { container } = render(
    <FileStatusIcon {...{
      isTrackedFormUpload: true,
      hasRestrictedAccess: true
    }}
    />
  );
  expect(container.querySelector('.font-icon-address-card')).not.toBe(null);
});

test('FileStatusIcon.render() shows the form submission alert icon if access unrestricted', () => {
  const { container } = render(
    <FileStatusIcon {...{
      isTrackedFormUpload: true,
      hasRestrictedAccess: false
    }}
    />
  );
  expect(container.querySelector('.font-icon-address-card-warning')).not.toBe(null);
});

test('FileStatusIcon.render() can add an extraClassName to the container', () => {
  const { container } = render(
    <FileStatusIcon {...{
      hasRestrictedAccess: true,
      extraClassName: 'myclassname'
    }}
    />
  );
  expect(container.querySelector('.file-status-icon').classList).toContain('myclassname');
});

test('FileStatusIcon.render() has no background by default', () => {
  const { container } = render(
    <FileStatusIcon {...{
      hasRestrictedAccess: true,
    }}
    />
  );
  expect(container.querySelector('.file-status-icon').classList).not.toContain('file-status-icon--background');
});

test('FileStatusIcon.render() has a background if added', () => {
  const { container } = render(
    <FileStatusIcon {...{
      hasRestrictedAccess: true,
      includeBackground: true
    }}
    />
  );
  expect(container.querySelector('.file-status-icon').classList).toContain('file-status-icon--background');
});
