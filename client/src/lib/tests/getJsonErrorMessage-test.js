/* global test */

import getJsonErrorMessage from '../getJsonErrorMessage';

test('getJsonErrorMessage known error', async () => {
  const err = {
    response: {
      json: () => Promise.resolve({
        errors: [{ value: 'My error message', }],
      }),
    },
  };
  const actual = await getJsonErrorMessage(err);
  expect(actual).toBe('My error message');
});

test('getJsonErrorMessage unknown error', async () => {
  const err = {};
  const actual = await getJsonErrorMessage(err);
  expect(actual).toBe('An unknown error has occurred.');
});
