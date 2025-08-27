/* global jest, expect, test */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Component as Paginator } from '../Paginator';

function makeProps(obj = {}) {
  return {
    totalItems: 10,
    maxItemsPerPage: 5,
    currentPage: 1,
    onChangePage: () => null,
    ...obj
  };
}

test('Paginator renders options', () => {
  let nextPage = null;
  const onChangePage = jest.fn((page) => {
    nextPage = page;
  });
  const { container } = render(<Paginator {...makeProps({
    onChangePage,
  })}
  />);
  const select = container.querySelector('.paginator-page select');
  const options = select.querySelectorAll('option');
  expect(options.length).toBe(2);
  expect(options[0].value).toBe('1');
  expect(options[1].value).toBe('2');
  fireEvent.change(select, { target: { value: '2' } });
  expect(onChangePage).toHaveBeenCalled();
  expect(nextPage).toBe(2);
});

test('Paginator renders next button when on first page and not prev button', () => {
  let nextPage = null;
  const onChangePage = jest.fn((page) => {
    nextPage = page;
  });
  const { container } = render(<Paginator {...makeProps({
    onChangePage,
  })}
  />);
  expect(container.querySelectorAll('.paginator-prev button').length).toBe(0);
  expect(container.querySelector('.paginator-next button .visually-hidden').innerHTML).toBe('Next');
  fireEvent.click(screen.getByText('Next'));
  expect(onChangePage).toHaveBeenCalled();
  expect(nextPage).toBe(2);
});

test('Paginator renders prev button when not on first page and not next button', () => {
  let nextPage = null;
  const onChangePage = jest.fn((page) => {
    nextPage = page;
  });
  const { container } = render(<Paginator {...makeProps({
    currentPage: 2,
    onChangePage,
  })}
  />);
  expect(container.querySelector('.paginator-prev button .visually-hidden').innerHTML).toBe('Previous');
  expect(container.querySelectorAll('.paginator-next button').length).toBe(0);
  fireEvent.click(screen.getByText('Previous'));
  expect(onChangePage).toHaveBeenCalled();
  expect(nextPage).toBe(1);
});

test('Paginator renders both buttons when it needs to', () => {
  const { container } = render(<Paginator {...makeProps({
    currentPage: 2,
    totalItems: 11,
  })}
  />);
  expect(container.querySelector('.paginator-prev button .visually-hidden').innerHTML).toBe('Previous');
  expect(container.querySelector('.paginator-next button .visually-hidden').innerHTML).toBe('Next');
});
