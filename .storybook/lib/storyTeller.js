const path = require('path');
const glob = require('fast-glob');
const fs = require('fs');
const dir = require('node-dir');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const configName = '.ss-storybook.js';

module.exports = {
  /**
   * "Collect" modules within the vendor folder OR the project root to show stories from. This will
   * find any `.ss-storybook.js` file that provides configuration for locating stories (and their
   * dependencies)
   *
   * @param {string} root
   * @return {Array<Object>} Discovered configuration
   */
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

  /**
   * Trigger a `yarn` in modules that have been "collected" but there doesn't appear to be a
   * node_modules folder. This is intended for use with `collectStoryRoots`
   *
   * @param {Array<Object>} storyRoots
   * @return {Promise<void>}
   */
  async assertYarn(storyRoots) {
    const promises = [];

    storyRoots.forEach(config => {
      try {
        fs.accessSync(`${config.path}/node_modules/`)
      } catch (err) {
        console.log(`Running yarn in "${config.path}`);
        promises.push(exec(`cd ${config.path}; yarn`));
      }
    });

    await Promise.all(promises);
  },

  /**
   * Generate an array of paths to files
   * which match with provided pattern
   * in source directories.
   *
   * @param {Array<Object>} storyRoots
   * @return {Array<string>} output The output filename
   */
  generateStoriesLoader(storyRoots) {
    const storyFiles = [];
    storyRoots.forEach((story) => {
      const baseDir = path.resolve(__dirname, `../${story.src}`);
      const stories = dir
        .files(baseDir, {
          sync: true,
          recursive: true
        })
        .filter(function(file) {
          return file.match(story.fileMatcher)
        });
        storyFiles.push(...stories);
    });

    return storyFiles;
  },

  /**
   * Attempt to determine the project root. This is fairly dumb and will only return the folder that
   * is 3 folders up if a vendor folder does not exist in the current directory.
   *
   * @return {string}
   */
  getDefaultRoot() {
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
};
