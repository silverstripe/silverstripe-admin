import buildBaseContainer from './buildBaseContainer';

const buildReducerContainer = (base = buildBaseContainer()) => ({
  ...base,
});

export default buildReducerContainer;
