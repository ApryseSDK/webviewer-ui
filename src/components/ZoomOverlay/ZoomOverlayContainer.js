import React from 'react';
import actions from 'actions';
import selectors from 'selectors';
import { zoomTo, fitToPage, fitToWidth } from 'helpers/zoom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import FlyoutMenu from 'components/FlyoutMenu/FlyoutMenu';
import ZoomOverlay from './ZoomOverlay';
import DataElements from 'src/constants/dataElement';

function ZoomOverlayContainer() {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const [activeDocumentViewerKey] = useSelector((state) => [
    selectors.getActiveDocumentViewerKey(state),
  ]);

  function onClickZoomLevelOption(zoomLevel) {
    zoomTo(zoomLevel);
    dispatch(actions.closeElements([DataElements.ZOOM_OVERLAY]));
  }

  function onClickMarqueeZoom() {
    dispatch(actions.closeElements([DataElements.ZOOM_OVERLAY]));
  }

  return (
    <FlyoutMenu
      menu={DataElements.ZOOM_OVERLAY}
      trigger={DataElements.ZOOM_OVERLAY_BUTTON}
      ariaLabel={t('component.zoomOverlay')}
    >
      <ZoomOverlay
        zoomList={useSelector(selectors.getZoomList)}
        currentZoomLevel={useSelector(selectors.getZoom)}
        isReaderMode={useSelector(selectors.isReaderMode)}
        isMarqueeZoomActive={useSelector(selectors.getActiveToolName) === 'MarqueeZoomTool'}
        isMarqueeToolButtonDisabled={useSelector((state) => selectors.isElementDisabled(state, 'marqueeToolButton'))}
        fitToWidth={() => fitToWidth(activeDocumentViewerKey)}
        fitToPage={() => fitToPage(activeDocumentViewerKey)}
        onClickZoomLevelOption={onClickZoomLevelOption}
        onClickMarqueeZoom={onClickMarqueeZoom}
      />
    </FlyoutMenu>
  );
}

export default ZoomOverlayContainer;
