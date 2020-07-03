import Icon from 'components/Icon';
import core from 'core';
import { zoomTo } from 'helpers/zoom';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import FlyoutMenu from '../FlyoutMenu/FlyoutMenu';
import OverlayItem from '../OverlayItem';
import ToolButton from '../ToolButton';
import './ZoomOverlay.scss';

function ZoomOverlay() {
  const [t] = useTranslation();

  const zoomList = useSelector(selectors.getZoomList);

  return (
    <FlyoutMenu menu="zoomOverlay" trigger="zoomOverlayButton">
      <button className="ZoomItem" onClick={core.fitToWidth} aria-label={t('action.fitToWidth')}>
        <Icon className="ZoomIcon" glyph="icon-header-zoom-fit-to-width" />
        <div className="ZoomLabel">{t('action.fitToWidth')}</div>
      </button>
      <button className="ZoomItem" onClick={core.fitToPage} aria-label={t('action.fitToPage')}>
        <Icon className="ZoomIcon" glyph="icon-header-zoom-fit-to-page" />
        <div className="ZoomLabel">{t('action.fitToPage')}</div>
      </button>
      <div className="divider" />
      {zoomList.map((zoomValue, i) => (
        <OverlayItem key={i} onClick={() => zoomTo(zoomValue)} buttonName={`${zoomValue * 100}%`} />
      ))}
      <div className="dividerSmall" />
      <div className="ZoomItem">
        <Icon className="ZoomIcon" glyph="icon-header-zoom-marquee" />
        <ToolButton className="ZoomToolButton" toolName="MarqueeZoomTool" label={t('tool.Marquee')} />
      </div>
    </FlyoutMenu>
  );
}

export default ZoomOverlay;
