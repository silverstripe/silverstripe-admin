const Path = require('path');

module.exports = {
  MODULES: 'node_modules',
  THIRDPARTY: '../../thirdparty',
  ROOT: Path.resolve(),
  SRC: Path.resolve('client/src'),
  DIST: Path.resolve('client/dist'),
  LEGACY_SRC: Path.resolve('client/src/legacy'),
};
