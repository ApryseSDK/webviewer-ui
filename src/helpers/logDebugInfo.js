import getHashParameters from 'helpers/getHashParameters';
import packageConfig from '../../package.json';

/* eslint-disable no-console */
export default () => {
  // log UI and Core versions and warn/error if necessary
  const coreVersion = window.Core.DocumentViewer.prototype.version;
  const coreBuild = window.Core.DocumentViewer.prototype.build;
  const uiVersion = packageConfig.version;
  const webViewerJSVersion = getHashParameters('webViewerJSVersion', null);
  const wvServer = !!getHashParameters('webviewerServerURL', null);
  const fullAPI = !!getHashParameters('pdfnet', false);
  const disableLogs = getHashParameters('disableLogs', false);
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

    let webViewerJSMajorVersion = null;
    let webViewerJSMinorVersion = null;
    if (webViewerJSVersion) {
      [webViewerJSMajorVersion, webViewerJSMinorVersion] = webViewerJSVersion
        .split('.')
        .map(version => parseInt(version, 10));
    }

    if (console.table) {
      const versions = {
        'UI version': uiVersion,
        'Core version': coreVersion,
        'webviewer.min.js': webViewerJSVersion,
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

    // if there's any major version differences, log with console.error
    // if there's only minor version differences, log with console.warn
    const webViewerComponents = [
      {
        name: 'Core',
        version: coreVersion,
        majorVersion: coreMajorVersion,
        minorVersion: coreMinorVersion
      },
      {
        name: 'UI',
        version: uiVersion,
        majorVersion: uiMajorVersion,
        minorVersion: uiMinorVersion
      },
    ];

    if (webViewerJSVersion === null) {
      console.error(
        'WebViewerJS version not found. Please update webviewer.min.js to the latest version.',
      );
    } else {
      webViewerComponents.push({
        name: 'webviewer.min.js',
        version: webViewerJSVersion,
        majorVersion: webViewerJSMajorVersion,
        minorVersion: webViewerJSMinorVersion,
      });
    }

    webViewerComponents.sort((a, b) => {
      let comparison = null;
      if (a.majorVersion !== b.majorVersion) {
        comparison = b.majorVersion - a.majorVersion;
      } else if (a.minorVersion !== b.minorVersion) {
        comparison = b.minorVersion - a.minorVersion;
      }
      return comparison;
    });

    let warningText = '[WebViewer] Version Mismatch: ';
    const majorVersionOutdatedComponents = [];
    const minorVersionOutdatedComponents = [];
    const latestComponent = webViewerComponents[0];

    webViewerComponents.forEach(component => {
      if (latestComponent.majorVersion > component.majorVersion) {
        majorVersionOutdatedComponents.push(component.name);
      } else if (latestComponent.minorVersion > component.minorVersion) {
        minorVersionOutdatedComponents.push(component.name);
      }
    });
    if (majorVersionOutdatedComponents.length) {
      const outdatedComponents =
        majorVersionOutdatedComponents.concat(minorVersionOutdatedComponents);
      warningText += `${outdatedComponents.join(' and ')} should be updated to version ${latestComponent.version}`;
      console.error(warningText);
    } else if (minorVersionOutdatedComponents.length) {
      warningText += `${minorVersionOutdatedComponents.join(' and ')} should be updated to version ${latestComponent.version}`;
      console.warn(warningText);
    }
  }
};