import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import core from 'core';
import classNames from 'classnames';

import ToggleElementButton from 'components/ToggleElementButton';
import ActionButton from 'components/ActionButton';
import { zoomTo, zoomIn, zoomOut } from 'helpers/zoom';
import selectors from 'selectors';
import actions from 'actions';
import useMedia from 'hooks/useMedia';
import zoomFactors from 'constants/zoomFactors';

import './ToggleZoomOverlay.scss';
import { useTranslation } from 'react-i18next';

const ToggleZoomOverlay = ({ documentViewerKey = undefined }) => {
  const [t] = useTranslation();

  const elementName = documentViewerKey ? `zoomOverlay${documentViewerKey}` : 'zoomOverlay';
  const buttonName = documentViewerKey ? `zoomOverlayButton${documentViewerKey}` : 'zoomOverlay';

  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  const [isActive, isMultiViewerMode] = useSelector((state) => [
    selectors.isElementOpen(state, elementName),
    selectors.isMultiViewerMode(state),
  ],
  shallowEqual,
  );
  const dispatch = useDispatch();
  const [value, setValue] = useState('100');

  useEffect(() => {
    const onDocumentLoaded = () => setValue(Math.ceil(core.getZoom(documentViewerKey) * 100).toString());
    const onZoomUpdated = () => setValue(Math.ceil(core.getZoom(documentViewerKey) * 100).toString());
    const onDocumentUnloaded = () => setValue('100');

    core.addEventListener('documentLoaded', onDocumentLoaded, undefined, documentViewerKey);
    core.addEventListener('zoomUpdated', onZoomUpdated, undefined, documentViewerKey);
    core.addEventListener('documentUnloaded', onDocumentUnloaded, undefined, documentViewerKey);

    return () => {
      core.removeEventListener('documentLoaded', onDocumentLoaded, documentViewerKey);
      core.removeEventListener('zoomUpdated', onZoomUpdated, documentViewerKey);
      core.removeEventListener('documentUnloaded', onDocumentUnloaded, documentViewerKey);
    };
  }, []);

  const onKeyPress = (e) => {
    if (e.nativeEvent.key === 'Enter' || e.nativeEvent.keyCode === 13) {
      const zoom = Math.ceil(core.getZoom(documentViewerKey) * 100).toString();
      if (e.target.value === zoom) {
        return;
      }
      if (e.target.value === '') {
        setValue(zoom);
      } else {
        let zoomValue = (e.target.value) / 100;
        zoomValue = Math.max(zoomValue, zoomFactors.getMinZoomLevel());
        zoomValue = Math.min(zoomValue, zoomFactors.getMaxZoomLevel());
        zoomTo(zoomValue, isMultiViewerMode, documentViewerKey);
      }
    }
  };

  const onChange = (e) => {
    const re = /^(\d){0,4}$/;
    if (re.test(e.target.value) || e.target.value === '') {
      setValue(e.target.value);
    }
  };

  const onBlur = (e) => {
    const zoom = Math.ceil(core.getZoom(documentViewerKey) * 100).toString();
    if (e.target.value === zoom) {
      return;
    }
    if (e.target.value === '' || isNaN(Number(e.target.value))) {
      setValue(zoom);
    } else {
      setValue(Number(e.target.value).toString());
      zoomTo(e.target.value / 100, documentViewerKey);
    }
  };

  const inputWidth = value ? (value.length + 1) * 8 : 0;

  return (
    <div className="zoom-overlay">
      {!isMobile &&
        <div className="ToggleZoomOverlay">
          <div
            className={classNames({
              OverlayContainer: true,
              active: isActive,
            })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                dispatch(actions.toggleElement('zoomOverlay'));
              }
            }}
            tabIndex={0}
          >
            <div
              className="OverlayText"
              onClick={() => dispatch(actions.toggleElement(elementName))}
            >
              <input
                type="text"
                className="textarea"
                value={value}
                onChange={onChange}
                onKeyPress={onKeyPress}
                onBlur={onBlur}
                tabIndex={-1}
                style={{ width: inputWidth }}
                aria-label={t('action.zoomSet')}
              />
              <span>%</span>
            </div>
            <ToggleElementButton
              className="OverlayButton"
              img={`icon-chevron-${isActive ? 'up' : 'down'}`}
              element={elementName}
              dataElement={buttonName}
              ariaLabel={t('action.zoomControls')}
              tabIndex={-1}
            />
          </div>
        </div>}
      <ActionButton
        img="icon-header-zoom-out-line"
        onClick={() => zoomOut(isMultiViewerMode, documentViewerKey)}
        title="action.zoomOut"
        dataElement="zoomOutButton"
      />
      <ActionButton
        img="icon-header-zoom-in-line"
        onClick={() => zoomIn(isMultiViewerMode, documentViewerKey)}
        title="action.zoomIn"
        dataElement="zoomInButton"
      />
    </div>
  );
};

export default ToggleZoomOverlay;
