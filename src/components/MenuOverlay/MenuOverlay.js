import actions from 'actions';
import DataElementWrapper from 'components/DataElementWrapper';
import Icon from 'components/Icon';
import ActionButton from 'components/ActionButton';
import { workerTypes } from 'constants/types';
import core from 'core';
import { isIOS, isIE } from 'helpers/device';
import downloadPdf from 'helpers/downloadPdf';
import openFilePicker from 'helpers/openFilePicker';
import { print } from 'helpers/print';
import toggleFullscreen from 'helpers/toggleFullscreen';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import FlyoutMenu from '../FlyoutMenu/FlyoutMenu';
import './MenuOverlay.scss';

import html2canvas from 'html2canvas';

function MenuOverlay() {
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const [documentType, setDocumentType] = useState(null);

  const activeTheme = useSelector(selectors.getActiveTheme);
  const isEmbedPrintSupported = useSelector(selectors.isEmbedPrintSupported);
  const colorMap = useSelector(selectors.getColorMap);
  const sortStrategy = useSelector(selectors.getSortStrategy);
  const isFullScreen = useSelector(selectors.isFullScreen);

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
    var div = document.createElement("div");
    div.className = 'blah';
    div.style.color = 'red';
    div.style.backgroundColor = 'blue';
    div.style.padding = '20px 40px';
    div.style.borderRadius = '5px';
    div.innerText = 'Meanwhile in Finland';
    print(dispatch, isEmbedPrintSupported, sortStrategy, colorMap, {
      pagesToPrint: [1],
      // includeComments: true,
      // includeAnnotations: true,
      additionalPagesToPrint: [
        // div
      ]
    });
  };

  const downloadDocument = () => {
    downloadPdf(dispatch, { includeAnnotations: false });
  };

  return (
    <FlyoutMenu menu="menuOverlay" trigger="menuButton" onClose={undefined} ariaLabel={t('component.menuOverlay')}>
      <ActionButton
        dataElement="filePickerButton"
        className="row"
        img="icon-header-file-picker-line"
        label={t('action.openFile')}
        ariaLabel={t('action.openFile')}
        role="option"
        onClick={openFilePicker}
      />
      <ActionButton
        dataElement="fullscreenButton"
        className="row"
        img={isFullScreen ? 'icon-header-full-screen-exit' : 'icon-header-full-screen'}
        label={isFullScreen ? t('action.exitFullscreen') : t('action.enterFullscreen')}
        ariaLabel={isFullScreen ? t('action.exitFullscreen') : t('action.enterFullscreen')}
        role="option"
        onClick={toggleFullscreen}
      />
      {documentType !== workerTypes.XOD && (
        <ActionButton
          dataElement="downloadButton"
          className="row"
          img="icon-header-download"
          label={t('action.download')}
          ariaLabel={t('action.download')}
          role="option"
          onClick={downloadDocument}
        />
      )}
      <ActionButton
        dataElement="printButton"
        className="row"
        img="icon-header-print-line"
        label={t('action.print')}
        ariaLabel={t('action.print')}
        role="option"
        onClick={handlePrintButtonClick}
      />
      {!isIE && (
        <ActionButton
          dataElement="themeChangeButton"
          className="row"
          img={`icon - header - mode - ${activeTheme === 'dark' ? 'day' : 'night'}`}
          label={activeTheme === 'dark' ? t('action.lightMode') : t('action.darkMode')}
          ariaLabel={activeTheme === 'dark' ? t('action.lightMode') : t('action.darkMode')}
          role="option"
          onClick={activeTheme === 'dark' ? setActiveLightTheme : setActiveDarkTheme}
        />
      )}
    </FlyoutMenu>
  );
}

export default MenuOverlay;
