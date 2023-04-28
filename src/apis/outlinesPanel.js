import actions from 'actions';

/**
 * @namespace UI.OutlinesPanel
 */

/**
 * @method UI.OutlinesPanel.setDefaultOptions
 * @param {object} [options] Options for the OutlinesPanel.
 * @param {boolean} [options.autoExpandOutlines] If set to true, will expand outlines.
 * @example
WebViewer(...)
  .then((instance) => {
    instance.UI.OutlinesPanel.setDefaultOptions({
      autoExpandOutlines: true,
    })
  });
 */

const setDefaultOptions = (store) => (options) => {
  const defaultOptions = {
    autoExpandOutlines: false,
  };

  const outlinesPanelOptions = {
    ...defaultOptions,
    ...options,
  };

  const { autoExpandOutlines } = outlinesPanelOptions;
  store.dispatch(actions.setAutoExpandOutlines(autoExpandOutlines));
};

export {
  setDefaultOptions,
};
