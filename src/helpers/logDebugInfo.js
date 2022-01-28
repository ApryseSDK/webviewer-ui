import getHashParams from 'helpers/getHashParams';
import packageConfig from '../../package.json';

/* eslint-disable no-console */
export default () => {
  // log UI and Core versions and warn/error if necessary
  const coreVersion = window.Core.DocumentViewer.prototype.version;
  const coreBuild = window.Core.DocumentViewer.prototype.build;
  const uiVersion = packageConfig.version;
  const wvServer = !!getHashParams('webviewerServerURL', null);
  const fullAPI = !!getHashParams('pdfnet', false);
  const disableLogs = getHashParams('disableLogs', false);

  if (disableLogs) {
    return;
  }

  if (coreVersion && uiVersion) {
    // we are using semantic versioning (ie ###.###.###) so the first number is the major version, follow by the minor version, and the patch number
    const [coreMajorVersion, coreMinorVersion] = coreVersion
      .split('.')
      .map(version => parseInt(version, 10));
    const [uiMajorVersion, uiMinorVersion] = uiVersion
      .split('.')
      .map(version => parseInt(version, 10));

    if (console.table) {
      const versions = {
        'UI version': uiVersion,
        'Core version': coreVersion,
        'Build': coreBuild,
        'WebViewer Server': wvServer,
        'Full API': fullAPI,
      };
      console.table(versions);
    } else {
      console.log(
        `[WebViewer] UI version: ${uiVersion}, Core version: ${coreVersion}, Build: ${coreBuild}, WebViewer Server: ${wvServer}, Full API: ${fullAPI}`,
      );
    }

    if (coreMajorVersion < uiMajorVersion) {
      console.error(
        `[WebViewer] Version Mismatch: UI requires Core version ${uiVersion} and above.`,
      );
    } else if (coreMinorVersion < uiMinorVersion) {
      console.warn(
        `[WebViewer] Version Mismatch: UI requires Core version ${uiVersion} and above.`,
      );
    }
  }
};
