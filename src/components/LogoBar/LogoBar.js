import './LogoBar.scss';
import React from 'react';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import { useSelector } from 'react-redux';
import packageConfig from '../../../package.json';
import Button from '../Button';
import { isMobileSize } from 'src/helpers/getDeviceSize';

const LogoBar = () => {
  const [
    isDisabled,
  ] = useSelector((state) => [
    selectors.isElementDisabled(state, DataElements.LOGO_BAR),
  ]);

  const logoText = isMobileSize() ? 'Apryse' : 'Powered by Apryse';
  const versionText = isMobileSize() ? packageConfig.version : `Version ${packageConfig.version}`;
  const apryseURL = 'https://apryse.com/products/webviewer';
  const apryseRedirect = () => {
    window.top.location.href = apryseURL;
  };

  return isDisabled ? null : (
    <div className="LogoBar" data-element={DataElements.LOGO_BAR}>
      <div className="logo-container">
        <Button
          className="logo-button"
          img="apryse-logo"
          dataElement="apryseLogoButton"
          label={logoText}
          onClick={apryseRedirect}
        />
      </div>
      <div className="version-container">
        <a href={apryseURL} target="_top" className="version">{versionText}</a>
      </div>
    </div>
  );
};

export default LogoBar;
