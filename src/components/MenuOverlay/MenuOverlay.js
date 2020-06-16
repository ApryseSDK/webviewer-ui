import { focusableElementDomString } from '@pdftron/webviewer-react-toolkit';
import actions from 'actions';
import classNames from 'classnames';
import DataElementWrapper from 'components/DataElementWrapper';
import Icon from 'components/Icon';
import { workerTypes } from 'constants/types';
import core from 'core';
import { findFocusableIndex } from 'core/accessibility';
import { isIOS } from 'helpers/device';
import downloadPdf from 'helpers/downloadPdf';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import openFilePicker from 'helpers/openFilePicker';
import print from 'helpers/print';
import toggleFullscreen from 'helpers/toggleFullscreen';
import useMedia from 'hooks/useMedia';
import useOnClickOutside from 'hooks/useOnClickOutside';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Swipeable } from 'react-swipeable';
import selectors from 'selectors';
import './MenuOverlay.scss';

const ALL_OTHER_ELEMENTS = [
  'groupOverlay',
  'viewControlsOverlay',
  'searchOverlay',
  'signatureOverlay',
  'zoomOverlay',
  'redactionOverlay',
];

function MenuOverlay() {
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const overlayRef = useRef();

  const [position, setPosition] = useState(() => ({ left: 0, right: 'auto', top: 'auto' }));
  const [documentType, setDocumentType] = useState(null);

  const isMobile = useMedia(['(max-width: 640px)'], [true], false);
  const isTabletOrMobile = useMedia(['(max-width: 900px)'], [true], false);

  const activeTheme = useSelector(selectors.getActiveTheme);
  const isEmbedPrintSupported = useSelector(selectors.isEmbedPrintSupported);
  const isFullScreen = useSelector(selectors.isFullScreen);
  const isDisabled = useSelector(state => selectors.isElementDisabled(state, 'menuOverlay'));
  const isFilePickerButtonDisabled = useSelector(state => selectors.isElementDisabled(state, 'filePickerButton'));
  const isOpen = useSelector(state => selectors.isElementOpen(state, 'menuOverlay'));

  const closeMenuOverlay = useCallback(() => dispatch(actions.closeElements(['menuOverlay'])), [dispatch]);
  const setActiveLightTheme = useCallback(() => dispatch(actions.setActiveTheme('light')), [dispatch]);
  const setActiveDarkTheme = useCallback(() => dispatch(actions.setActiveTheme('dark')), [dispatch]);

  useOnClickOutside(overlayRef, closeMenuOverlay);

  const getFocusableElements = useCallback(() => {
    return overlayRef.current.querySelectorAll(focusableElementDomString);
  }, []);

  useEffect(() => {
    if (!isDisabled && isOpen) {
      const lastFocusedElement = document.activeElement;

      const keydownListener = e => {
        // Tab closes the menu.
        if (e.key === 'Tab') {
          e.preventDefault();
          closeMenuOverlay();
          if (lastFocusedElement) {
            lastFocusedElement.focus();
          }
          return;
        }

        // Up and Down keys used to navigate overlay menu.
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          const focusable = getFocusableElements();

          if (focusable.length === 0) {
            return;
          }

          const focusIndex = findFocusableIndex(focusable, document.activeElement);

          if (e.key === 'ArrowUp') {
            if (focusIndex <= 0) {
              focusable[focusable.length - 1].focus();
            } else {
              focusable[focusIndex - 1].focus();
            }
          } else {
            if (focusIndex >= focusable.length - 1) {
              focusable[0].focus();
            } else {
              focusable[focusIndex + 1].focus();
            }
          }
        }
      };

      window.addEventListener('keydown', keydownListener);
      return () => {
        window.removeEventListener('keydown', keydownListener);
      };
    }
  }, [closeMenuOverlay, getFocusableElements, isDisabled, isOpen]);

  useEffect(() => {
    const onDocumentLoaded = () => setDocumentType(core.getDocument().getType());
    core.addEventListener('documentLoaded', onDocumentLoaded);
    return () => {
      core.removeEventListener('documentLoaded', onDocumentLoaded);
    };
  }, []);

  useEffect(() => {
    dispatch(actions.closeElements(ALL_OTHER_ELEMENTS));
    setPosition(getOverlayPositionBasedOn('menuButton', overlayRef, isTabletOrMobile));
  }, [dispatch, isTabletOrMobile]);

  const handlePrintButtonClick = () => {
    closeMenuOverlay();
    print(dispatch, isEmbedPrintSupported);
  };

  const downloadDocument = () => {
    downloadPdf(dispatch);
  };

  if (isDisabled) {
    return null;
  }

  const overlayClass = classNames('Overlay', 'MenuOverlay', {
    mobile: isMobile,
    closed: !isOpen,
  });

  return (
    <Swipeable onSwipedUp={closeMenuOverlay} onSwipedDown={closeMenuOverlay} preventDefaultTouchmoveEvent>
      <div
        className={overlayClass}
        data-element="menuOverlay"
        style={!isMobile ? position : undefined}
        ref={overlayRef}
      >
        {isMobile && <div className="swipe-indicator" />}
        {!isFilePickerButtonDisabled && (
          <DataElementWrapper className="row" dataElement="filePickerButton">
            <button className="MenuItem" onClick={openFilePicker}>
              <Icon className="MenuIcon" glyph="icon-header-file-picker-line" />
              <div className="MenuLabel">{t('action.openFile')}</div>
            </button>
          </DataElementWrapper>
        )}
        {!isIOS && (
          <div className="row">
            <button className="MenuItem" onClick={toggleFullscreen}>
              <Icon
                className="MenuIcon"
                glyph={isFullScreen ? 'icon-header-full-screen-exit' : 'icon-header-full-screen'}
              />
              <div className="MenuLabel">{isFullScreen ? t('action.exitFullscreen') : t('action.enterFullscreen')}</div>
            </button>
          </div>
        )}
        {documentType !== workerTypes.XOD && (
          <DataElementWrapper className="row" dataElement="downloadButton">
            <button className="MenuItem" onClick={downloadDocument}>
              <Icon className="MenuIcon" glyph="icon-header-download" />
              <div className="MenuLabel">{t('action.download')}</div>
            </button>
          </DataElementWrapper>
        )}
        <DataElementWrapper className="row" dataElement="printButton">
          <button className="MenuItem" onClick={handlePrintButtonClick}>
            <Icon className="MenuIcon" glyph="icon-header-print-line" />
            <div className="MenuLabel">{t('action.print')}</div>
          </button>
        </DataElementWrapper>
        <div className="row">
          <button className="MenuItem" onClick={activeTheme === 'dark' ? setActiveLightTheme : setActiveDarkTheme}>
            <Icon className="MenuIcon" glyph={`icon - header - mode - ${activeTheme === 'dark' ? 'day' : 'night'}`} />
            <div className="MenuLabel">{activeTheme === 'dark' ? t('action.lightMode') : t('action.darkMode')}</div>
          </button>
        </div>
      </div>
    </Swipeable>
  );
}

export default MenuOverlay;
