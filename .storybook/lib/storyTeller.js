const path = require('path');
const glob = require('fast-glob');
const fs = require('fs');
const chalk = require('chalk');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const configName = '.ss-storybook.js';

/**
 * Locates modules in the given root (matching the base path and any composer style vendor folder
 * within that root) that define a .ss-storybook.js config file.
 *
 * Note that this function will also generate a .stories.js file that declares module roots in a way
 * that can be static analyzed for webpack to build a valid bundle for storybook. This script should
 * run before or during the webpack bundle for storybook.
 *
 * Returns an array of module configuration
 *
 * @param {string} root Root location to find stories
 * @param {bool} generate
 * @reutn {Array<Object>}
 */
module.exports = {
  collectStoryRoots(root) {
    const modules = glob.sync(
      [`${root}/${configName}`, `${root}/vendor/**/${configName}`],
      { deep: 3 }
    );

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
  },

  async assertYarn(storyRoots) {
    const promises = [];

    storyRoots.forEach(config => {
      try {
        fs.accessSync(`${config.path}/node_modules/`)
      } catch (err) {
        console.log(chalk.yellow(`Running yarn in "${config.path}`));
        promises.push(exec(`cd ${config.path}; yarn`));
      }
    });

    await Promise.all(promises);
  },

  generateStoriesLoader(storyRoots, output = `${__dirname}/../.stories.js`) {
    const realOutput = fs.realpathSync(output);

    const script = `export default [\n${storyRoots.reduce((acc, { src, fileMatcher }) => {
      const matcher = fileMatcher instanceof RegExp
        ? fileMatcher.toString()
        : fileMatcher;

      return `${acc}  require.context('${src}', true, ${matcher}),\n`;
    }, '')}];`;

    console.log(`Outputting story loader file to "${chalk.yellow(realOutput)}".`);

    fs.writeFile(realOutput, script, err => {
      if (err) {
        console.log(chalk.bgRed(`Could not export modules: ${err}`));
      }
    });
  },

  getDefaultRoot() {
    // Check if a `vendor` folder exists in the project root.
    let projectRoot = path.resolve(`${__dirname}/../../`);

    try {
      fs.accessSync(`${projectRoot}/vendor/`);
    } catch (err) {
      projectRoot = path.resolve(`${projectRoot}/../../../`);
    }

    return projectRoot;
  }
};
