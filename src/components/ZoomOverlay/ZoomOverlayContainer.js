import React from 'react';
import actions from 'actions';
import selectors from 'selectors';
import ZoomOverlay from './ZoomOverlay';
import { zoomTo, fitToPage, fitToWidth } from 'helpers/zoom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import FlyoutMenu from 'components/FlyoutMenu/FlyoutMenu';

function ZoomOverlayContainer(props) {
  const dispatch = useDispatch();
  const [t] = useTranslation();

  function onClickZoomLevelOption(zoomLevel) {
    zoomTo(zoomLevel);
    dispatch(actions.closeElements(['zoomOverlay']));
  }
  
  function onClickMarqueeZoom() {
    dispatch(actions.closeElements(['zoomOverlay']));
  }

  return (
    <FlyoutMenu menu="zoomOverlay" trigger="zoomOverlayButton" ariaLabel={t('component.zoomOverlay')}>
      <ZoomOverlay
        zoomList={useSelector(selectors.getZoomList)}
        currentZoomLevel={useSelector(selectors.getZoom)}
        isReaderMode={useSelector(selectors.isReaderMode)}
        isMarqueeZoomActive={useSelector(selectors.getActiveToolName) === 'MarqueeZoomTool'}
        isMarqueeToolButtonDisabled={useSelector(state => selectors.isElementDisabled(state, 'marqueeToolButton'))}
        fitToWidth={fitToPage}
        fitToPage={fitToWidth}
        onClickZoomLevelOption={onClickZoomLevelOption}
        onClickMarqueeZoom={onClickMarqueeZoom}
      />
    </FlyoutMenu>
  );
}

export default ZoomOverlayContainer;
