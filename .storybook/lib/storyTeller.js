const path = require('path');
const glob = require('fast-glob');
const fs = require('fs');
// const chalk = require('chalk');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

// import path from 'path';
// import glob from 'glob';
// import fs from 'fs';
// import chalk from 'chalk';
// import { promisify } from 'util';
// import exec from 'child_process';
// // const promisifiedExec = promisify(exec);
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

const configName = '.ss-storybook.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

/**
 * "Collect" modules within the vendor folder OR the project root to show stories from. This will
 * find any `.ss-storybook.js` file that provides configuration for locating stories (and their
 * dependencies)
 *
 * @param {string} root
 * @return {Array<Object>} Discovered configuration
 */
const collectStoryRoots = function(root) {
  // console.log(['root', root, configName, `${root}/vendor/**/${configName}`]);
  let modules = glob.sync(`${root}/${configName}`, { deep: 3 });
  modules = modules.concat(glob.sync(`${root}/vendor/**/${configName}`, { deep: 3 }));

  const output = [];

  // Config exported should indicate the source directory

  modules.forEach(file => {
    const config = require(file);

    if (!config.src) {
      console.error(`Invalid config found in ${file}`);
      return;
    }

    const moduleRoot = file.replace(configName, '');

    output.push({
      ...config,
      path: moduleRoot,
      src: path.relative(`${__dirname}/../`, file.replace(configName, config.src)),
    });
  });

  return output;
};

/**
 * Trigger a `yarn` in modules that have been "collected" but there doesn't appear to be a
 * node_modules folder. This is intended for use with `collectStoryRoots`
 *
 * @param {Array<Object>} storyRoots
 * @return {Promise<void>}
 */
const assertYarn = async function(storyRoots) {
  const promises = [];

  storyRoots.forEach(config => {
    try {
      fs.accessSync(`${config.path}/node_modules/`)
    } catch (err) {
      // console.log(chalk.yellow(`Running yarn in "${config.path}`));
      console.log(`Running yarn in "${config.path}`);
      promises.push(promisify(() => {exec(`cd ${config.path}; yarn`);}));
    }
  });

  await Promise.all(promises);
}

/**
   * Generate a JavaScript file to the given output location that declares what contexts should be
   * included when storybook builds bundles with webpack. This is generated as webpack cannot handle
   * compiling dynamic routes - it will need to statically analyze file paths.
   *
   * @param {Array<Object>} storyRoots
   * @param {string} output The output filename
   */
const generateStoriesLoader = function(storyRoots, output = `${__dirname}/../.stories.js`) {
  const script = `export default [\n${storyRoots.reduce((acc, { src, fileMatcher }) => {
    const matcher = fileMatcher instanceof RegExp
      ? fileMatcher.toString()
      : fileMatcher;
    return `${acc}  require.context('${src}', true, ${matcher}),\n`;
  }, '')}];`;

  fs.writeFile(output, script, err => {
    if (err) {
      // console.log(chalk.bgRed(`Could not export modules: ${err}`));
      console.log(`Could not export modules: ${err}`);
    }
  });
  // console.log(`Outputted story loader file to "${chalk.yellow(fs.realpathSync(output))}".`);
  console.log(`Outputted story loader file to "${fs.realpathSync(output)}".`);
}

/**
 * Attempt to determine the project root. This is fairly dumb and will only return the folder that
 * is 3 folders up if a vendor folder does not exist in the current directory.
 *
 * @return {string}
 */
const getDefaultRoot = function() {
  // Move up to the admin root.
  let projectRoot = path.resolve(`${__dirname}/../../`);
  try {
    // Check if there's a `vendor` folder
    fs.accessSync(`${projectRoot}/vendor/`);
  } catch (err) {
    // Assume that we're already in vendor, so the root must be 3 folders up.
    projectRoot = path.resolve(`${projectRoot}/../../../`);
  }
  return projectRoot;
}

module.exports = {
  collectStoryRoots,
  assertYarn,
  generateStoriesLoader,
  getDefaultRoot
};
