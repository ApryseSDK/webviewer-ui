import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import core from 'core';
import classNames from 'classnames';

import ToggleElementButton from 'components/ToggleElementButton';
import ActionButton from 'components/ActionButton';
import { zoomTo, zoomIn, zoomOut } from 'helpers/zoom';
import selectors from 'selectors';
import actions from 'actions';

import './ToggleZoomOverlay.scss';

const ToggleZoomOverlay = () => {
  const [isActive] = useSelector(
    state => [selectors.isElementOpen(state, 'zoomOverlay')],
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [value, setValue] = useState('100');

  useEffect(() => {
    const onDocumentLoaded = () =>
      setValue(Math.ceil(core.getZoom() * 100).toString());
    const onZoomUpdated = () =>
      setValue(Math.ceil(core.getZoom() * 100).toString());

    core.addEventListener('documentLoaded', onDocumentLoaded);
    core.addEventListener('zoomUpdated', onZoomUpdated);

    return () => {
      core.removeEventListener('documentLoaded', onDocumentLoaded);
      core.removeEventListener('zoomUpdated', onZoomUpdated);
    };
  }, []);

  const onKeyPress = e => {
    if (e.nativeEvent.key === 'Enter' || e.nativeEvent.keyCode === 13) {
      const zoom = Math.ceil(core.getZoom() * 100).toString();
      if (e.target.value === zoom) {
        return;
      }
      if (e.target.value === '') {
        setValue(zoom);
      } else {
        zoomTo(Number(e.target.value) / 100);
      }
    }
  };

  const onChange = e => {
    const re = /^(\d){0,4}$/;
    if (re.test(e.target.value) || e.target.value === '') {
      setValue(e.target.value);
    }
  };

  const onBlur = e => {
    const zoom = Math.ceil(core.getZoom() * 100).toString();
    if (e.target.value === zoom) {
      return;
    }
    if (e.target.value === '' || isNaN(Number(e.target.value))) {
      setValue(zoom);
    } else {
      setValue(Number(e.target.value).toString());
      zoomTo(e.target.value / 100);
    }
  };

  const inputWidth = value ? (value.length + 1) * 8 : 0;

  return (
    <div className="zoom-overlay">
      <div className="ToggleZoomOverlay">
        <div
          className={classNames({
            OverlayContainer: true,
            active: isActive,
          })}
        >
          <div
            className="OverlayText"
            onClick={() => dispatch(actions.toggleElement('zoomOverlay'))}
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
            />
            <span>%</span>
          </div>
          <ToggleElementButton
            className="OverlayButton"
            img="icon-chevron-down"
            element="zoomOverlay"
            dataElement="zoomOverlay"
          />
        </div>
      </div>
      <ActionButton
        img="icon-header-zoom-out-line"
        onClick={zoomOut}
        title="action.zoomOut"
        dataElement="zoomOutButton"
      />
      <ActionButton
        img="icon-header-zoom-in-line"
        onClick={zoomIn}
        title="action.zoomIn"
        dataElement="zoomInButton"
      />
    </div>
  );
};

export default ToggleZoomOverlay;
