import actions from 'actions';
import ActionButton from 'components/ActionButton';
import CustomElement from 'components/CustomElement';
import { workerTypes } from 'constants/types';
import core from 'core';
import downloadPdf from 'helpers/downloadPdf';
import openFilePicker from 'helpers/openFilePicker';
import { print } from 'helpers/print';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import FlyoutMenu from '../FlyoutMenu/FlyoutMenu';
import DataElements from 'constants/dataElement';

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

  const [documentType, setDocumentType] = useState(null);

  const isEmbedPrintSupported = useSelector(selectors.isEmbedPrintSupported);
  const colorMap = useSelector(selectors.getColorMap);
  const sortStrategy = useSelector(selectors.getSortStrategy);

  const closeMenuOverlay = useCallback(() => dispatch(actions.closeElements(['menuOverlay'])), [dispatch]);

  useEffect(() => {
    const onDocumentLoaded = () => setDocumentType(core.getDocument().getType());
    core.addEventListener('documentLoaded', onDocumentLoaded);
    return () => {
      core.removeEventListener('documentLoaded', onDocumentLoaded);
    };
  }, []);

  const handlePrintButtonClick = () => {
    closeMenuOverlay();
    print(dispatch, isEmbedPrintSupported, sortStrategy, colorMap);
  };

  const downloadDocument = () => {
    downloadPdf(dispatch);
  };

  const openSaveModal = () => dispatch(actions.openElement('saveModal'));

  const handleSettingsButtonClick = () => {
    closeMenuOverlay();
    dispatch(actions.openElement(DataElements.SETTINGS_MODAL));
  };

  return (
    <FlyoutMenu menu="menuOverlay" trigger="menuButton" onClose={undefined} ariaLabel={t('component.menuOverlay')}>
      <InitialMenuOverLayItem>
        <ActionButton
          dataElement="filePickerButton"
          className="row"
          img="icon-header-file-picker-line"
          label={t('action.openFile')}
          ariaLabel={t('action.openFile')}
          role="option"
          onClick={openFilePicker}
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
          dataElement="saveAsButton"
          className="row"
          img="icon-save"
          label={t('saveModal.saveAs')}
          ariaLabel={t('saveModal.saveAs')}
          role="option"
          onClick={openSaveModal}
        />
        <ActionButton
          dataElement="printButton"
          className="row"
          img="icon-header-print-line"
          label={t('action.print')}
          ariaLabel={t('action.print')}
          role="option"
          onClick={handlePrintButtonClick}
        />
      </InitialMenuOverLayItem>
      <div className="divider"></div>
      <ActionButton
        dataElement="settingsButton"
        className="row"
        img="icon-header-settings-line"
        label={t('option.settings.settings')}
        ariaLabel={t('settings')}
        role="option"
        onClick={handleSettingsButtonClick}
      />
    </FlyoutMenu>
  );
}

export default MenuOverlay;
