import actions from 'actions';
import DataElementWrapper from 'components/DataElementWrapper';
import Icon from 'components/Icon';
import { workerTypes } from 'constants/types';
import core from 'core';
import { isIOS, isIE } from 'helpers/device';
import downloadPdf from 'helpers/downloadPdf';
import openFilePicker from 'helpers/openFilePicker';
import print from 'helpers/print';
import toggleFullscreen from 'helpers/toggleFullscreen';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import FlyoutMenu from '../FlyoutMenu/FlyoutMenu';
import './MenuOverlay.scss';

function MenuOverlay() {
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const [documentType, setDocumentType] = useState(null);

  const activeTheme = useSelector(selectors.getActiveTheme);
  const isEmbedPrintSupported = useSelector(selectors.isEmbedPrintSupported);
  const isFullScreen = useSelector(selectors.isFullScreen);
  const isFilePickerButtonDisabled = useSelector(state => selectors.isElementDisabled(state, 'filePickerButton'));

  const closeMenuOverlay = useCallback(() => dispatch(actions.closeElements(['menuOverlay'])), [dispatch]);
  const setActiveLightTheme = useCallback(() => dispatch(actions.setActiveTheme('light')), [dispatch]);
  const setActiveDarkTheme = useCallback(() => dispatch(actions.setActiveTheme('dark')), [dispatch]);

  useEffect(() => {
    const onDocumentLoaded = () => setDocumentType(core.getDocument().getType());
    core.addEventListener('documentLoaded', onDocumentLoaded);
    return () => {
      core.removeEventListener('documentLoaded', onDocumentLoaded);
    };
  }, []);

  const handlePrintButtonClick = () => {
    closeMenuOverlay();
    print(dispatch, isEmbedPrintSupported);
  };

  const downloadDocument = () => {
    downloadPdf(dispatch);
  };

  return (
    <FlyoutMenu menu="menuOverlay" trigger="menuButton" onClose={undefined}>
      {!isFilePickerButtonDisabled && (
        <DataElementWrapper className="row" dataElement="filePickerButton">
          <button className="MenuItem" onClick={openFilePicker} aria-label={t('action.openFile')}>
            <Icon className="MenuIcon" glyph="icon-header-file-picker-line" />
            <div className="MenuLabel">{t('action.openFile')}</div>
          </button>
        </DataElementWrapper>
      )}
      {!isIOS && (
        <DataElementWrapper className="row" dataElement="fullscreenButton">
          <button
            className="MenuItem"
            onClick={toggleFullscreen}
            aria-label={isFullScreen ? t('action.exitFullscreen') : t('action.enterFullscreen')}
          >
            <Icon
              className="MenuIcon"
              glyph={isFullScreen ? 'icon-header-full-screen-exit' : 'icon-header-full-screen'}
            />
            <div className="MenuLabel">{isFullScreen ? t('action.exitFullscreen') : t('action.enterFullscreen')}</div>
          </button>
        </DataElementWrapper>
      )}
      {documentType !== workerTypes.XOD && (
        <DataElementWrapper className="row" dataElement="downloadButton">
          <button className="MenuItem" onClick={downloadDocument} aria-label={t('action.download')}>
            <Icon className="MenuIcon" glyph="icon-header-download" />
            <div className="MenuLabel">{t('action.download')}</div>
          </button>
        </DataElementWrapper>
      )}
      <DataElementWrapper className="row" dataElement="printButton">
        <button className="MenuItem" onClick={handlePrintButtonClick} aria-label={t('action.print')}>
          <Icon className="MenuIcon" glyph="icon-header-print-line" />
          <div className="MenuLabel">{t('action.print')}</div>
        </button>
      </DataElementWrapper>
      {!isIE && (
        <DataElementWrapper className="row" dataElement="themeChangeButton">
          <button
            className="MenuItem"
            onClick={activeTheme === 'dark' ? setActiveLightTheme : setActiveDarkTheme}
            aria-label={activeTheme === 'dark' ? t('action.lightMode') : t('action.darkMode')}
          >
            <Icon className="MenuIcon" glyph={`icon - header - mode - ${activeTheme === 'dark' ? 'day' : 'night'}`} />
            <div className="MenuLabel">{activeTheme === 'dark' ? t('action.lightMode') : t('action.darkMode')}</div>
          </button>
        </DataElementWrapper>)}
    </FlyoutMenu>
  );
}

export default MenuOverlay;
