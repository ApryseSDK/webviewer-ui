import getHashParameters from 'helpers/getHashParameters';

/**
 * A getter that returns a stringified version of the 'custom' property that is passed to the WebViewer constructor
 * <a href='https://www.pdftron.com/documentation/web/guides/config-files/#passing-custom-data' target='_blank'>Refer to the passing custom data section</a>.
 * @method UI.getCustomData
 * @returns {string} returns a stringified version of the 'custom' property that is passed to the WebViewer constructor
 */
export default () => getHashParameters('custom', null);