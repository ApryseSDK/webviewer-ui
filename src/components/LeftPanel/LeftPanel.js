import React, { useState } from 'react';
import classNames from 'classnames';
import { useSelector, shallowEqual } from 'react-redux';

import LeftPanelTabs from 'components/LeftPanelTabs';
import ThumbnailsPanel from 'components/ThumbnailsPanel';
import OutlinesPanel from 'components/OutlinesPanel';
import BookmarksPanel from 'components/BookmarksPanel';
import LayersPanel from 'components/LayersPanel';
import CustomElement from 'components/CustomElement';
import ResizeBar from 'components/ResizeBar';

import selectors from 'selectors';

import './LeftPanel.scss';

const LeftPanel = () => {
  const [activePanel, customPanels] = useSelector(
    state => [
      selectors.getActiveLeftPanel(state),
      selectors.getCustomPanels(state),
    ],
    shallowEqual,
  );
  const [width, setWidth] = useState(293);

  const getDisplay = panel => (panel === activePanel ? 'flex' : 'none');

  return (
    <div
      className={classNames({
        Panel: true,
        LeftPanel: true,
      })}
      data-element="leftPanel"
      style={{ width: `${width}px` }}
    >
      <div className="left-panel-container">
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
      <ResizeBar
        minWidth={215}
        onResize={_width => {
          setWidth(_width);
        }}
      />
    </div>
  );
};

export default LeftPanel;
