import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import LeftPanelTabs from 'components/LeftPanelTabs';
import ThumbnailsPanel from 'components/ThumbnailsPanel';
import OutlinesPanel from 'components/OutlinesPanel';
import BookmarksPanel from 'components/BookmarksPanel';
import LayersPanel from 'components/LayersPanel';
import CustomElement from 'components/CustomElement';
import Icon from 'components/Icon';

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

        <ThumbnailsPanel display={getDisplay('thumbnailsPanel')} />
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
        onResize={_width => {
          setWidth(_width);
        }}
      />
    </div>
  );
};

export default LeftPanel;

const ResizeBar = ({ onResize }) => {
  const isMouseDownRef = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // this listener is throttled because the notes panel listens to the panel width
    // change in order to rerender to have the correct width and we don't want
    // it to rerender too often
    const dragMouseMove = _.throttle(({ clientX }) => {
      if (isMouseDownRef.current && clientX < 900) {
        onResize(Math.max(293, clientX));
      }
    }, 50);

    document.addEventListener('mousemove', dragMouseMove);
    return () => document.removeEventListener('mousemove', dragMouseMove);
  }, [dispatch, onResize]);

  useEffect(() => {
    const finishDrag = () => {
      isMouseDownRef.current = false;
    };

    document.addEventListener('mouseup', finishDrag);
    return () => document.removeEventListener('mouseup', finishDrag);
  }, []);

  return (
    <div
      className="resize-bar"
      onMouseDown={() => {
        isMouseDownRef.current = true;
      }}
    >
      <Icon glyph="icon-detach-toolbar" />
    </div>
  );
};
