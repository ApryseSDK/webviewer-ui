import React from 'react';
import FlyoutMenu from 'components/FlyoutMenu/FlyoutMenu';
import ZoomOverlay from 'components/ZoomOverlay/ZoomOverlay';
import { useSelector, useDispatch } from 'react-redux';
import { fitToWidth, fitToPage, zoomTo } from 'helpers/zoom';
import selectors from 'selectors';
import actions from 'actions';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const propTypes = {
  zoom1: PropTypes.number,
  zoom2: PropTypes.number,
};

const CompareZoomOverlay = ({
  zoom1,
  zoom2,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onClickMarqueeZoom = (documentViewerKey) => () => {
    dispatch(actions.closeElements([`zoomOverlay${documentViewerKey}`]));
  };
  const onClickZoomLevelOption = (documentViewerKey) => (zoomLevel) => {
    zoomTo(zoomLevel, true, documentViewerKey);
    dispatch(actions.closeElements([`zoomOverlay${documentViewerKey}`]));
  };
  const onClickMarqueeZoom1 = onClickMarqueeZoom(1);
  const onClickMarqueeZoom2 = onClickMarqueeZoom(2);
  const onClickZoomLevelOption1 = onClickZoomLevelOption(1);
  const onClickZoomLevelOption2 = onClickZoomLevelOption(2);
  const onFitToWidth1 = () => fitToWidth(1);
  const onFitToWidth2 = () => fitToWidth(2);
  const onFitToPage1 = () => fitToPage(1);
  const onFitToPage2 = () => fitToPage(2);

  return (
    <>
      <FlyoutMenu menu={'zoomOverlay1'} trigger={'zoomOverlayButton1'}
        ariaLabel={t('component.zoomOverlay')}
      >
        <ZoomOverlay
          zoomList={useSelector(selectors.getZoomList)}
          currentZoomLevel={zoom1}
          isReaderMode={useSelector(selectors.isReaderMode)}
          isMarqueeZoomActive={useSelector(selectors.getActiveToolName) === 'MarqueeZoomTool'}
          isMarqueeToolButtonDisabled={useSelector((state) => selectors.isElementDisabled(state, 'marqueeToolButton'))}
          fitToWidth={onFitToWidth1}
          fitToPage={onFitToPage1}
          onClickZoomLevelOption={onClickZoomLevelOption1}
          onClickMarqueeZoom={onClickMarqueeZoom1}
        />
      </FlyoutMenu>
      <FlyoutMenu menu={'zoomOverlay2'} trigger={'zoomOverlayButton2'}
        ariaLabel={t('component.zoomOverlay')}
      >
        <ZoomOverlay
          zoomList={useSelector(selectors.getZoomList)}
          currentZoomLevel={zoom2}
          isReaderMode={useSelector(selectors.isReaderMode)}
          isMarqueeZoomActive={useSelector(selectors.getActiveToolName) === 'MarqueeZoomTool'}
          isMarqueeToolButtonDisabled={useSelector((state) => selectors.isElementDisabled(state, 'marqueeToolButton'))}
          fitToWidth={onFitToWidth2}
          fitToPage={onFitToPage2}
          onClickZoomLevelOption={onClickZoomLevelOption2}
          onClickMarqueeZoom={onClickMarqueeZoom2}
        />
      </FlyoutMenu>
    </>
  );
};

CompareZoomOverlay.propTypes = propTypes;

export default CompareZoomOverlay;
