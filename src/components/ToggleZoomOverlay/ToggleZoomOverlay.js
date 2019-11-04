import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import core from 'core';

import ToggleElementButton from 'components/ToggleElementButton';
import { zoomTo } from 'helpers/zoom';
import selectors from 'selectors';
import actions from 'actions';

import './ToggleZoomOverlay.scss';

const propTypes = {
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
};

const ToggleZoomOverlay = ({
  onClick,
  isActive,
}) => {
  const [value, setValue] = useState('100');

  useEffect(() => {
    const onDocumentLoaded = () => setValue(Math.ceil(core.getZoom() * 100).toString());
    const onZoomUpdated = () => setValue(Math.ceil(core.getZoom() * 100).toString());

    core.addEventListener('documentLoaded', onDocumentLoaded);
    core.addEventListener('zoomUpdated', onZoomUpdated);

    return () => {
      core.removeEventListener('documentLoaded', onDocumentLoaded);
      core.removeEventListener('zoomUpdated', onZoomUpdated);
    };
  });

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

  return (
    <div className="ToggleZoomOverlay">
      <div className={['OverlayContainer', isActive ? 'active' : ''].join(' ').trim()}>
        <div className="OverlayText" onClick={onClick}>
          <input
            type="text"
            className="textarea"
            value={value}
            onChange={onChange}
            onKeyPress={onKeyPress}
            onBlur={onBlur}
            tabIndex={-1}
          />
          <span>%</span>
        </div>
        <ToggleElementButton className="OverlayButton" img="ic-triangle" element="zoomOverlay" dataElement="zoomOverlay"/>
      </div>
    </div>
  );
};

ToggleZoomOverlay.propTypes = propTypes;

const mapStateToProps = state => ({
  isActive: selectors.isElementOpen(state, 'zoomOverlay'),
});

const mapDispatchToProps = dispatch => ({
  onClick: () => {
    dispatch(actions.toggleElement('zoomOverlay'));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleZoomOverlay);
