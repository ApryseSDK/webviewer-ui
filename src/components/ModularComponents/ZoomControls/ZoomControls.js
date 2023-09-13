import React from 'react';
import classNames from 'classnames';
import ToggleElementButton from '../ToggleElementButton';
import CustomButton from '../CustomButton';
import { useTranslation } from 'react-i18next';
import './ZoomControls.scss';

function ZoomControls(props) {
  const {
    setZoomHandler,
    zoomValue,
    zoomTo,
    isZoomFlyoutMenuActive,
    dataElement,
    isActive,
    onClick,
    onFlyoutToggle,
    elementRef,
    size,
    onZoomInClicked,
    onZoomOutClicked,
    getCurrentZoom,
  } = props;

  const [t] = useTranslation();
  const INPUT_WIDTH_MULTIPLIER = 8;

  const isZoomValueValid = (zoomValue) => {
    const regex = /^(\d){0,4}$/;
    return regex.test(zoomValue) || zoomValue === '';
  };

  const handleChange = (e) => {
    if (isZoomValueValid(e.target.value)) {
      setZoomHandler(e.target.value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isZoomValueValid(e.target.value)) {
      zoomTo(e.target.value / 100);
    }
  };

  const onBlur = (e) => {
    const zoom = getCurrentZoom();
    if (e.target.value === zoom) {
      return;
    }
    if (e.target.value === '' || isNaN(Number(e.target.value))) {
      setZoomHandler(zoom);
    } else {
      setZoomHandler(Number(e.target.value).toString());
      zoomTo(e.target.value / 100);
    }
  };

  const inputWidth = zoomValue ? (zoomValue.length + 1) * INPUT_WIDTH_MULTIPLIER : 0;

  return (
    <div className="ZoomContainerWrapper" data-element={dataElement} ref={elementRef}>
      {size === 0 && <>
        <div className="ToggleZoomMenu">
          <div tabIndex={0}
            className={classNames({
              ZoomContainer: true,
              active: isActive,
            })}
          >
            <div className="ZoomText"
              onClick={() => onClick}>
              <input
                type="text"
                className="textarea"
                value={zoomValue}
                onChange={handleChange}
                onBlur={onBlur}
                onKeyDown={handleKeyDown}
                tabIndex={-1}
                style={{ width: inputWidth }}
                aria-label={t('action.zoomSet')}
              />
              <span>%</span>
            </div>
            <ToggleElementButton
              dataElement="zoom-toggle-button"
              className="zoomToggleButton"
              title="Zoom Toggle Button"
              disabled={false}
              img={`icon-chevron-${isZoomFlyoutMenuActive ? 'up' : 'down'}`}
              toggleElement="zoomFlyoutMenu"
              tabIndex={-1}
              onFlyoutToggled={onFlyoutToggle}
            />
          </div>
        </div>
        <CustomButton
          img="icon-header-zoom-out-line"
          onClick={onZoomOutClicked}
          title="action.zoomOut"
          dataElement="zoomOutButton"
          className="zoomButton"
        />
        <CustomButton
          img="icon-header-zoom-in-line"
          onClick={onZoomInClicked}
          title="action.zoomIn"
          dataElement="zoomInButton"
          className="zoomButton"
        />
      </>}
      {size === 1 && <>
        <ToggleElementButton
          dataElement="zoom-toggle-button"
          className="zoomToggleButton"
          title="Zoom Toggle Button"
          disabled={false}
          img={'icon-magnifying-glass'}
          toggleElement="zoomFlyoutMenu"
          tabIndex={-1}
          onFlyoutToggled={onFlyoutToggle}
        />
      </>}
    </div>
  );
}

export default ZoomControls;
