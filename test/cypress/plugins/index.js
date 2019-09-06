// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const {
  addMatchImageSnapshotPlugin,
} = require('cypress-image-snapshot/plugin');

module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, args) => {
    if (browser.name === 'chrome' || browser.name === 'chromium') {
      // https://github.com/cypress-io/cypress/issues/2102#issuecomment-521299946
      args.push('--cast-initial-screen-width=1600');
      args.push('--cast-initial-screen-height=900');
      /**
       * Standardize it so that the image comparison won't fail for different screen size / pixel ratio
       */
      args.push('--force-device-scale-factor=1');
      return args;
    }
  });
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  addMatchImageSnapshotPlugin(on, config);
};
