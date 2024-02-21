import { useLayoutEffect, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import { isOfficeEditorMode } from 'helpers/officeEditor';
import openFilePicker from 'helpers/openFilePicker';
import downloadPdf from 'helpers/downloadPdf';
import toggleFullscreen from 'helpers/toggleFullscreen';
import { print } from 'helpers/print';
import loadDocument from 'helpers/loadDocument';
import { workerTypes } from 'constants/types';
import DataElements from 'constants/dataElement';
import { menuItems } from '../Helpers/menuItems';

const MainMenuFlyout = () => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const [documentType, setDocumentType] = useState();

  const [
    isDisabled,
    currentFlyout,
    isEmbedPrintSupported,
    colorMap,
    sortStrategy,
    isFullScreen,
    timezone,
    isFilePickerDisabled,
    isDownloadDisabled,
    isPrintDisabled,
    isSaveAsDisabled,
  ] = useSelector((state) => [
    selectors.isElementDisabled(state, 'MainMenuFlyout'),
    selectors.getFlyout(state, 'MainMenuFlyout'),
    selectors.isEmbedPrintSupported(state),
    selectors.getColorMap(state),
    selectors.getSortStrategy(state),
    selectors.isFullScreen(state),
    selectors.getTimezone(state),
    selectors.isElementDisabled(state, DataElements.FILE_PICKER_BUTTON),
    selectors.isElementDisabled(state, DataElements.DOWNLOAD_BUTTON),
    selectors.isElementDisabled(state, DataElements.PRINT_BUTTON),
    selectors.isElementDisabled(state, DataElements.SAVE_AS_BUTTON),
  ], shallowEqual);

  const isCreatePortfolioButtonEnabled = !useSelector((state) => selectors.isElementDisabled(state, DataElements.CREATE_PORTFOLIO_BUTTON)) && core.isFullPDFEnabled();
  const closeMenuFlyout = useCallback(() => dispatch(actions.closeElements(['MainMenuFlyout'])), [dispatch]);

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
  }, [documentType]);

  useLayoutEffect(() => {
    const MainMenuFlyout = {
      dataElement: 'MainMenuFlyout',
      className: 'MainMenuFlyout',
      items: getMainMenuItems()
    };

    if (!currentFlyout) {
      dispatch(actions.addFlyout(MainMenuFlyout));
    } else {
      dispatch(actions.updateFlyout(MainMenuFlyout.dataElement, MainMenuFlyout));
    }
  }, [documentType, isFullScreen,
    isFilePickerDisabled, isDownloadDisabled, isPrintDisabled,
    isSaveAsDisabled,
    isCreatePortfolioButtonEnabled,
  ]);

  if (isDisabled) {
    return;
  }

  const handlePrintButtonClick = () => {
    closeMenuFlyout();
    print(dispatch, isEmbedPrintSupported, sortStrategy, colorMap, { isGrayscale: core.getDocumentViewer().isGrayscaleModeEnabled(), timezone });
  };

  const downloadDocument = () => {
    downloadPdf(dispatch);
  };

  const openSaveModal = () => {
    closeMenuFlyout();
    dispatch(actions.openElement(DataElements.SAVE_MODAL));
  };

  const handleSettingsButtonClick = () => {
    closeMenuFlyout();
    dispatch(actions.openElement(DataElements.SETTINGS_MODAL));
  };

  const handlePortfolioButtonClick = () => {
    closeMenuFlyout();
    dispatch(actions.openElement(DataElements.CREATE_PORTFOLIO_MODAL));
  };

  const handleNewDocumentClick = async () => {
    closeMenuFlyout();
    loadDocument(dispatch, null, {
      filename: 'Untitled.docx',
      enableOfficeEditing: true
    });
  };

  const handleFilePickerButtonClick = () => {
    closeMenuFlyout();
    openFilePicker();
  };

  const getMainMenuItems = () => {
    const menuFlyoutItems = [];
    const divider = 'divider';

    if (isOfficeEditorMode()) {
      const newDocumentButton = {
        ...menuItems.newDocumentButton,
        onClick: handleNewDocumentClick
      };
      menuFlyoutItems.push(newDocumentButton);
    }
    if (!isFilePickerDisabled) {
      const filePickerButton = {
        ...menuItems.filePickerButton,
        onClick: handleFilePickerButtonClick
      };
      menuFlyoutItems.push(filePickerButton);
    }
    if (!isDownloadDisabled && documentType !== workerTypes.XOD && !isOfficeEditorMode()) {
      const downloadButton = {
        ...menuItems.downloadButton,
        onClick: downloadDocument,
      };
      menuFlyoutItems.push(downloadButton);
    }

    if (isOfficeEditorMode()) {
      const fullscreenButton = {
        dataElement: 'fullscreenButton',
        icon: isFullScreen ? 'icon-header-full-screen-exit' : 'icon-header-full-screen',
        label: isFullScreen ? t('action.exitFullscreen') : t('action.enterFullscreen'),
        title: isFullScreen ? t('action.exitFullscreen') : t('action.enterFullscreen'),
        onClick: toggleFullscreen,
      };
      menuFlyoutItems.push(fullscreenButton);
    }

    if (!isSaveAsDisabled && documentType !== workerTypes.XOD) {
      const saveAsButton = {
        ...menuItems.saveAsButton,
        onClick: openSaveModal,
      };
      menuFlyoutItems.push(saveAsButton);
    }

    if (!isPrintDisabled) {
      const printButton = {
        ...menuItems.printButton,
        onClick: handlePrintButtonClick,
      };
      menuFlyoutItems.push(printButton);
    }
    menuFlyoutItems.push(divider);
    if (isCreatePortfolioButtonEnabled) {
      const createPortfolioButton = {
        ...menuItems.createPortfolioButton,
        onClick: handlePortfolioButtonClick,
        isActive: false
      };
      menuFlyoutItems.push(createPortfolioButton, divider);
    }

    const settingsButton = {
      ...menuItems.settingsButton,
      onClick: handleSettingsButtonClick,
    };
    menuFlyoutItems.push(settingsButton);

    return menuFlyoutItems;
  };

  return null;
};

export default MainMenuFlyout;
