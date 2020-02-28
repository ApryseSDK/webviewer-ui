import React, { useState } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import LeftPanelTabs from 'components/LeftPanelTabs';
import ThumbnailsPanel from 'components/ThumbnailsPanel';
import OutlinesPanel from 'components/OutlinesPanel';
import BookmarksPanel from 'components/BookmarksPanel';
import LayersPanel from 'components/LayersPanel';
import CustomElement from 'components/CustomElement';
import ResizeBar from 'components/ResizeBar';
import Icon from 'components/Icon';

import selectors from 'selectors';
import actions from 'actions';
import useMedia from 'hooks/useMedia';

import './LeftPanel.scss';

const LeftPanel = () => {
  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  const isTabletAndMobile = useMedia(
    // Media queries
    ['(max-width: 900px)'],
    [true],
    // Default value
    false,
  );

  const [activePanel, customPanels] = useSelector(
    state => [
      selectors.getActiveLeftPanel(state),
      selectors.getCustomPanels(state),
    ],
    shallowEqual,
  );
  const [width, setWidth] = useState(218);
  const dispatch = useDispatch();

  const getDisplay = panel => (panel === activePanel ? 'flex' : 'none');

  let style = {};
  if (!isMobile) {
    style = { width: `${width}px` };
  }

  return (
    <div
      className={classNames({
        Panel: true,
        LeftPanel: true,
      })}
      data-element="leftPanel"
      style={style}
    >
      <div className="left-panel-container">
        {isTabletAndMobile &&
          <div
            className="close-container"
          >
            <div
              className="close-icon-container"
              onClick={() => {
                dispatch(actions.closeElements(['leftPanel']));
              }}
            >
              <Icon
                glyph="ic_close_black_24px"
                className="close-icon"
              />
            </div>
          </div>}
        <div className="left-panel-header">
          <LeftPanelTabs />
        </div>

        <ThumbnailsPanel
          display={getDisplay('thumbnailsPanel')}
        />
        <OutlinesPanel display={getDisplay('outlinesPanel')} />
        <BookmarksPanel display={getDisplay('bookmarksPanel')} />
        <LayersPanel display={getDisplay('layersPanel')} />

        {customPanels.map(({ panel }, index) => (
          <CustomElement
            key={panel.dataElement || index}
            className={`Panel ${panel.dataElement}`}
            display={getDisplay(panel.dataElement)}
            dataElement={panel.dataElement}
            render={panel.render}
          />
        ))}
      </div>
      {!isTabletAndMobile &&
        <ResizeBar
          minWidth={215}
          onResize={_width => {
            setWidth(_width);
          }}
        />}
    </div>
  );
};

export default LeftPanel;
