let frozen = false;
const container = {};
const callbacks = {};

export const get = (key) => container[key];

export const register = (key, value) => {
  if (frozen) {
    throw new Error('Cannot mutate DI container after it has been initialised');
  }
  if (callbacks[key]) {
    const newComponent = callbacks[key](value);
    delete callbacks[key];
    register(key, newComponent);
  } else {
    container[key] = value;
  }
};

export const override = (key, callback) => {
  callbacks[key] = callback;
};

export const freeze = function () {
  frozen = true;
};
