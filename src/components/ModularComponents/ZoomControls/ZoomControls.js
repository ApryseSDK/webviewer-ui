import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ToggleElementButton from '../ToggleElementButton';
import CustomButton from '../CustomButton';
import { useTranslation } from 'react-i18next';
import './ZoomControls.scss';

function ZoomControls(props) {
  const { componentProps, dataElement, elementRef } = props;
  const {
    setZoomHandler,
    zoomValue,
    zoomTo,
    isZoomFlyoutMenuActive,
    isActive,
    setFlyoutTriggerRef,
    size,
    onZoomInClicked,
    onZoomOutClicked,
    getCurrentZoom,
    style,
    className,
  } = componentProps;

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
    <div className={classNames('ZoomContainerWrapper', {
      [`size${size}`]: true,
      [className]: true,
    })} data-element={dataElement} ref={elementRef} style={{ ...style }}>
      {size === 0 && <>
        <div className="ToggleZoomMenu">
          <div tabIndex={-1}
            className={classNames({
              ZoomContainer: true,
              active: isActive,
            })}
          >
            <div className="ZoomText">
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
              title={t('option.settings.zoomOptions')}
              disabled={false}
              img={`icon-chevron-${isZoomFlyoutMenuActive ? 'up' : 'down'}`}
              toggleElement={`${dataElement}Flyout`}
              tabIndex={-1}
              setFlyoutTriggerRef={setFlyoutTriggerRef}
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
          title={t('option.settings.zoomOptions')}
          disabled={false}
          img="icon-magnifying-glass"
          toggleElement={`${dataElement}Flyout`}
          tabIndex={-1}
          setFlyoutTriggerRef={setFlyoutTriggerRef}
        />
      </>}
    </div>
  );
}

ZoomControls.propTypes = {
  dataElement: PropTypes.string.isRequired,
  elementRef: PropTypes.object,
  componentProps: PropTypes.shape({
    setZoomHandler: PropTypes.func.isRequired,
    zoomValue: PropTypes.string.isRequired,
    zoomTo: PropTypes.func.isRequired,
    isZoomFlyoutMenuActive: PropTypes.bool.isRequired,
    isActive: PropTypes.bool,
    setFlyoutTriggerRef: PropTypes.func,
    size: PropTypes.number,
    onZoomInClicked: PropTypes.func,
    onZoomOutClicked: PropTypes.func,
    getCurrentZoom: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
  })
};

export default ZoomControls;
