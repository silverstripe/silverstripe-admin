const {
  collectStoryRoots,
  assertYarn,
  generateStoriesLoader,
  getDefaultRoot
} = require('../lib/storyTeller');

const main = async () => {
  const bookRoot = getDefaultRoot();

  console.log(` Using "${bookRoot}" as a storybook root `);

  const storyRoots = collectStoryRoots(bookRoot);

  await assertYarn(storyRoots);

  return generateStoriesLoader(storyRoots);
};

export default main;
