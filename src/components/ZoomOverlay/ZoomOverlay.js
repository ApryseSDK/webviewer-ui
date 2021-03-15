import { zoomTo, fitToPage, fitToWidth } from 'helpers/zoom';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import FlyoutMenu from '../FlyoutMenu/FlyoutMenu';
import OverlayItem from '../OverlayItem';
import ToolButton from '../ToolButton';
import Button from 'components/Button';
import './ZoomOverlay.scss';

function ZoomOverlay() {
  const [t] = useTranslation();

  const zoomList = useSelector(selectors.getZoomList);
  const isReaderMode = useSelector(selectors.isReaderMode);
  const isMarqueeToolButtonDisabled = useSelector(state => selectors.isElementDisabled(state, 'marqueeToolButton'));

  return (
    <FlyoutMenu menu="zoomOverlay" trigger="zoomOverlayButton" ariaLabel={t('component.zoomOverlay')}>
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
        <OverlayItem key={i} onClick={() => zoomTo(zoomValue)} buttonName={`${zoomValue * 100}%`} role="option" />
      ))}
      {!isReaderMode && (
        <>
          {!isMarqueeToolButtonDisabled && (
            <div className="dividerSmall" />
          )}
          <ToolButton
            className="ZoomItem"
            role="option"
            toolName="MarqueeZoomTool"
            label={t('tool.Marquee')}
            img="icon-header-zoom-marquee"
          />
        </>
      )}
    </FlyoutMenu>
  );
}

export default ZoomOverlay;
