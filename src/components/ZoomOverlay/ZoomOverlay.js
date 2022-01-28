import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import OverlayItem from '../OverlayItem';
import ToolButton from '../ToolButton';
import Button from 'components/Button';
import './ZoomOverlay.scss';
import classNames from 'classnames';

const propTypes = {
  zoomList: PropTypes.arrayOf(PropTypes.number).isRequired,
  currentZoomLevel: PropTypes.number.isRequired,
  isReaderMode: PropTypes.bool.isRequired,
  isMarqueeZoomActive: PropTypes.bool.isRequired,
  onClickZoomLevelOption: PropTypes.func.isRequired,
  onClickMarqueeZoom: PropTypes.func.isRequired,
  fitToWidth: PropTypes.func.isRequired,
  fitToPage: PropTypes.func.isRequired,
  isMarqueeToolButtonDisabled: PropTypes.bool
}

function ZoomOverlay(props) {
  const [t] = useTranslation();
  
  const { zoomList, currentZoomLevel, isReaderMode, isMarqueeZoomActive, fitToWidth, fitToPage, onClickZoomLevelOption, onClickMarqueeZoom, isMarqueeToolButtonDisabled } = props;
  
  return (
    <>
      <Button
        className="ZoomItem"
        img="icon-header-zoom-fit-to-width"
        label={t('action.fitToWidth')}
        ariaLabel={t('action.fitToWidth')}
        role="option"
        onClick={fitToWidth}
      />
      {!isReaderMode && (
        <Button
          className="ZoomItem"
          img="icon-header-zoom-fit-to-page"
          label={t('action.fitToPage')}
          ariaLabel={t('action.fitToPage')}
          role="option"
          onClick={fitToPage}
        />
      )}
      <div className="divider" />
      {zoomList.map((zoomValue, i) => (
        <OverlayItem key={i} onClick={() => onClickZoomLevelOption(zoomValue)} buttonName={`${zoomValue * 100}%`} selected={currentZoomLevel === zoomValue} role="option" />
      ))}
      {!isReaderMode && (
        <>
          {!isMarqueeToolButtonDisabled && (
            <div className="dividerSmall" />
          )}
          <div onClick={() => onClickMarqueeZoom()}>
            <ToolButton
              className={classNames({ZoomItem: true, selected: isMarqueeZoomActive})}
              role="option"
              toolName="MarqueeZoomTool"
              label={t('tool.Marquee')}
              img="icon-header-zoom-marquee"
            />
          </div>
        </>
      )}
    </>
  );
}

ZoomOverlay.propTypes = propTypes;

export default ZoomOverlay;
