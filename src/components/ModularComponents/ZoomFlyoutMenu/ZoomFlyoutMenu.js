import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import { zoomTo, fitToPage, fitToWidth } from 'helpers/zoom';
import './ZoomFlyoutMenu.scss';

const fitToWidthButton = {
  icon: 'icon-header-zoom-fit-to-width',
  label: 'action.fitToWidth',
  title: 'action.fitToWidth',
  onClick: fitToWidth,
  dataElement: 'fitToWidthButton'
};

const fitToPageButton = {
  icon: 'icon-header-zoom-fit-to-page',
  label: 'action.fitToPage',
  title: 'action.fitToPage',
  onClick: fitToPage,
  type: 'customButton',
  dataElement: 'fitToPageButton'
};

const ZoomFlyoutMenu = () => {
  const dispatch = useDispatch();
  const zoomOptionsList = useSelector(selectors.getZoomList);

  const onClickZoomLevelOption = (zoomLevel) => {
    zoomTo(zoomLevel);
    dispatch(actions.closeElement('zoomFlyoutMenu'));
  };

  const onMarqueeZoom = () => {
    dispatch(actions.closeElement('zoomFlyoutMenu'));
  };

  const marqueeButton = {
    icon: 'icon-header-zoom-marquee',
    toolName: 'MarqueeZoomTool',
    label: 'tool.Marquee',
    onClick: onMarqueeZoom,
    dataElement: 'marqueeButton'
  };

  const getZoomItems = () => {
    const divider = 'divider';
    const zoomItems = [fitToWidthButton, fitToPageButton, divider];
    zoomOptionsList.forEach((zoomValue) => {
      const item = {
        label: `${zoomValue * 100}%`,
        onClick: () => {
          onClickZoomLevelOption(zoomValue);
        },
        dataElement: `zoom-button-${zoomValue * 100}`
      };
      zoomItems.push(item);
    });
    zoomItems.push(divider);
    zoomItems.push(marqueeButton);
    return zoomItems;
  };

  useEffect(() => {
    const zoomFlyoutMenu = {
      dataElement: 'zoomFlyoutMenu',
      className: 'ZoomFlyoutMenu',
      items: getZoomItems()
    };

    dispatch(actions.addFlyout(zoomFlyoutMenu));
  }, []);

  return null;
};

export default ZoomFlyoutMenu;
