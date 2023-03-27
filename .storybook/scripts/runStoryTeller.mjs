import path from 'path';
import glob from 'fast-glob';
import fs from 'fs';
import chalk from 'chalk';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { exec } from 'child_process';
const execPromisified = promisify(exec);

//const exec = promisify(import('child_process').exec);

const configName = '.ss-storybook.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Attempt to determine the project root. This is fairly dumb and will only return the folder that
// is 3 folders up if a vendor folder does not exist in the current directory.
let projectRoot = path.resolve(`${__dirname}/../../`);
try {
  // Check if there's a `vendor` folder
  fs.accessSync(`${projectRoot}/vendor/`);
} catch (err) {
  // Assume that we're already in vendor, so the root must be 3 folders up.
  projectRoot = path.resolve(`${projectRoot}/../../../`);
}
console.log(chalk.bgBlue(` Using "${projectRoot}" as a storybook root `));

// "Collect" modules within the vendor folder OR the project root to show stories from. This will
// find any `.ss-storybook.js` config files that provides configuration for locating stories (and their dependencies)
const modules = glob.sync(
  [`${projectRoot}/${configName}`, `${projectRoot}/vendor/**/${configName}`],
  { deep: 3 }
);
const configs = [];
const importedConfigFiles = {};

// Config exported should indicate the source directory
modules.forEach(async (file) => {
  // import() returns a promise
  importedConfigFiles[file] = (await import(file)).default;
});

// simulate a sleep via setTimeout() so that promises above are resolved :p
setTimeout(() => {
  Object.keys(importedConfigFiles).forEach(file => {
    const moduleRoot = file.replace(configName, '');
    const importedConfigFile = importedConfigFiles[file];
    configs.push({
      ...importedConfigFile,
      path: moduleRoot,
      src: path.relative(`${__dirname}/../`, file.replace(configName, importedConfigFile.src)),
    });
  });

  // Run yarn async if required
  const promises = [];
  configs.forEach(config => {
    try {
      fs.accessSync(`${config.path}/node_modules/`);
      console.log(chalk.yellow(`node_modules aleady exists "${config.path}", not running yarn`));
    } catch (err) {
      console.log(chalk.yellow(`Running yarn in "${config.path}"`));
      promises.push(exec(`cd ${config.path}; yarn`));
    }
  });
  Promise.all(promises);

  // Generate .stories.js
  const output = `${__dirname}/../.stories.js`;

  const script = `export default [\n${configs.reduce((acc, { src, fileMatcher }) => {
    const matcher = fileMatcher instanceof RegExp ? fileMatcher.toString() : fileMatcher;
    return `${acc}  require.context('${src}', true, ${matcher}),\n`;
  }, '')}];`;

  fs.writeFile(output, script, err => {
    if (err) {
      console.log(chalk.bgRed(`Could not export modules: ${err}`));
    }
  });

  console.log(`Outputted story loader file to "${chalk.yellow(fs.realpathSync(output))}".`);
  
}, 250)
