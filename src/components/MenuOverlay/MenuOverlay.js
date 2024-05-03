import actions from 'actions';
import ActionButton from 'components/ActionButton';
import CustomElement from 'components/CustomElement';
import { workerTypes } from 'constants/types';
import core from 'core';
import downloadPdf from 'helpers/downloadPdf';
import openFilePicker from 'helpers/openFilePicker';
import toggleFullscreen from 'helpers/toggleFullscreen';
import { print } from 'helpers/print';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import FlyoutMenu from '../FlyoutMenu/FlyoutMenu';
import DataElements from 'constants/dataElement';
import loadDocument from 'helpers/loadDocument';
import { isOfficeEditorMode } from 'helpers/officeEditor';

import './MenuOverlay.scss';

const InitialMenuOverLayItem = ({ dataElement, children }) => {
  const items = useSelector((state) => selectors.getMenuOverlayItems(state, dataElement), shallowEqual);

  const childrenArray = React.Children.toArray(children);

  return items.map((item, i) => {
    const { dataElement, type, hidden } = item;
    const key = `${type}-${dataElement || i}`;
    const mediaQueryClassName = hidden?.map((screen) => `hide-in-${screen}`).join(' ');
    let component = childrenArray.find((child) => child.props.dataElement === dataElement);

    if (!component) {
      const props = { ...item, mediaQueryClassName };

      switch (type) {
        case 'actionButton':
          component = <ActionButton {...props} />;
          break;
        case 'customElement':
          component = <CustomElement {...props} />;
          break;
      }
    }

    return component
      ? React.cloneElement(component, {
        key,
      })
      : null;
  });
};

function MenuOverlay() {
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const [documentType, setDocumentType] = useState();

  const isEmbedPrintSupported = useSelector(selectors.isEmbedPrintSupported);
  const colorMap = useSelector(selectors.getColorMap);
  const sortStrategy = useSelector(selectors.getSortStrategy);
  const isFullScreen = useSelector((state) => selectors.isFullScreen(state));
  const timezone = useSelector((state) => selectors.getTimezone(state));
  const isCreatePortfolioButtonEnabled = !useSelector((state) => selectors.isElementDisabled(state, DataElements.CREATE_PORTFOLIO_BUTTON)) && core.isFullPDFEnabled();

  const closeMenuOverlay = useCallback(() => dispatch(actions.closeElements([DataElements.MENU_OVERLAY])), [dispatch]);

  useEffect(() => {
    const onDocumentLoaded = () => {
      const type = core.getDocument()?.getType();
      setDocumentType(type);
    };
    onDocumentLoaded();
    core.addEventListener('documentLoaded', onDocumentLoaded);
    return () => {
      core.removeEventListener('documentLoaded', onDocumentLoaded);
    };
  }, []);

  const handlePrintButtonClick = () => {
    closeMenuOverlay();
    print(dispatch, isEmbedPrintSupported, sortStrategy, colorMap, { isGrayscale: core.getDocumentViewer().isGrayscaleModeEnabled(), timezone });
  };

  const downloadDocument = () => {
    downloadPdf(dispatch);
  };

  const openSaveModal = () => {
    closeMenuOverlay();
    dispatch(actions.openElement(DataElements.SAVE_MODAL));
  };

  const handleSettingsButtonClick = () => {
    closeMenuOverlay();
    dispatch(actions.openElement(DataElements.SETTINGS_MODAL));
  };

  const handlePortfolioButtonClick = () => {
    closeMenuOverlay();
    dispatch(actions.openElement(DataElements.CREATE_PORTFOLIO_MODAL));
  };

  const handleNewDocumentClick = async () => {
    closeMenuOverlay();
    loadDocument(dispatch, null, {
      filename: 'Untitled.docx',
      enableOfficeEditing: true
    });
  };

  return (
    <FlyoutMenu
      menu={DataElements.MENU_OVERLAY}
      trigger={DataElements.MENU_OVERLAY_BUTTON}
      ariaLabel={t('component.menuOverlay')}
    >
      <InitialMenuOverLayItem>
        {isOfficeEditorMode() && (
          <ActionButton
            dataElement={DataElements.NEW_DOCUMENT_BUTTON}
            className="row"
            img="icon-plus-sign"
            label={t('action.newDocument')}
            ariaLabel={t('action.newDocument')}
            role="option"
            onClick={handleNewDocumentClick}
          />
        )}
        <ActionButton
          dataElement={DataElements.FILE_PICKER_BUTTON}
          className="row"
          img="icon-header-file-picker-line"
          label={t('action.openFile')}
          ariaLabel={t('action.openFile')}
          role="option"
          onClick={openFilePicker}
        />
        {documentType !== workerTypes.XOD && !isOfficeEditorMode() && (
          <ActionButton
            dataElement={DataElements.DOWNLOAD_BUTTON}
            className="row"
            img="icon-download"
            label={t('action.download')}
            ariaLabel={t('action.download')}
            role="option"
            onClick={downloadDocument}
          />
        )}
        {isOfficeEditorMode() && (
          <ActionButton
            dataElement={DataElements.FULLSCREEN_BUTTON}
            className="row"
            img={isFullScreen ? 'icon-header-full-screen-exit' : 'icon-header-full-screen'}
            label={isFullScreen ? t('action.exitFullscreen') : t('action.enterFullscreen')}
            ariaLabel={isFullScreen ? t('action.exitFullscreen') : t('action.enterFullscreen')}
            role="option"
            onClick={toggleFullscreen}
          />
        )}
        {documentType !== workerTypes.XOD && (
          <ActionButton
            dataElement={DataElements.SAVE_AS_BUTTON}
            className="row"
            img="icon-save"
            label={t('saveModal.saveAs')}
            ariaLabel={t('saveModal.saveAs')}
            role="option"
            onClick={openSaveModal}
          />
        )}
        <ActionButton
          dataElement={DataElements.PRINT_BUTTON}
          className="row"
          img="icon-header-print-line"
          label={t('action.print')}
          ariaLabel={t('action.print')}
          role="option"
          onClick={handlePrintButtonClick}
        />
      </InitialMenuOverLayItem>
      <div className="divider"></div>
      {isCreatePortfolioButtonEnabled && (
        <>
          <ActionButton
            dataElement={DataElements.CREATE_PORTFOLIO_BUTTON}
            className="row"
            img="icon-pdf-portfolio"
            label={t('portfolio.createPDFPortfolio')}
            ariaLabel={t('portfolio.createPDFPortfolio')}
            role="option"
            onClick={handlePortfolioButtonClick}
          />
          <div className="divider"></div>
        </>
      )}
      <ActionButton
        dataElement={DataElements.SETTINGS_BUTTON}
        className="row"
        img="icon-header-settings-line"
        label={t('option.settings.settings')}
        ariaLabel={t('option.settings.settings')}
        role="option"
        onClick={handleSettingsButtonClick}
      />
    </FlyoutMenu>
  );
}

export default MenuOverlay;
