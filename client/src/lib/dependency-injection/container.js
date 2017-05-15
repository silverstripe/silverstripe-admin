let frozen = false;
const container = {};


export const get = (key) => container[key];

export const register = (key, value) => {
  if (frozen) {
    throw new Error('Cannot mutate DI container after it has been initialised');
  }
  container[key] = value;
};

export const freeze = () => frozen = true;