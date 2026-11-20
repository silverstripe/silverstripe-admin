/* global test, expect */

import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusBadge from '../StatusBadge';

test('StatusBadge renders the text with the class of the status', () => {
  render(<StatusBadge status="modified" text="Modified" />);
  const badge = screen.getByText('Modified');
  expect(badge.className).toBe('status-badge status-badge--modified');
});
