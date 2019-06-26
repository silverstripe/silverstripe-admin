const {
  collectStoryRoots,
  assertYarn,
  generateStoriesLoader,
  getDefaultRoot
} = require('../lib/storyTeller');
const chalk = require('chalk');

const main = async () => {
  const bookRoot = getDefaultRoot();

  console.log(chalk.bgBlue(` Using "${bookRoot}" as a storybook root `));

  const storyRoots = collectStoryRoots(bookRoot);

  await assertYarn(storyRoots);

  generateStoriesLoader(storyRoots);
};

main();
