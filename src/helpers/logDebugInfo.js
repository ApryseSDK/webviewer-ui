import packageConfig from '../../package.json';

/* eslint-disable no-console */
export default ({ pdftronServer, fullAPI }) => {
  // log UI and Core versions and warn/error if necessary
  const coreVersion = window.CoreControls.DocumentViewer.prototype.version;
  const coreBuild = window.CoreControls.DocumentViewer.prototype.build;
  const uiVersion = packageConfig.version;
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
        'WebViewer Server': !!pdftronServer,
        'Full API': !!fullAPI
      };
      console.table(versions);
    } else {
      console.log(
        `[WebViewer] UI version: ${uiVersion}, Core version: ${coreVersion}, Build: ${coreBuild}, WebViewer Server: ${!!pdftronServer}, Full API: ${!!fullAPI}`,
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
