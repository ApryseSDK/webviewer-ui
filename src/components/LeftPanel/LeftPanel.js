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

import { motion, AnimatePresence } from "framer-motion";

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

  const [isOpen, isDisabled, activePanel, customPanels, currentWidth] = useSelector(
    state => [
      selectors.isElementOpen(state, 'leftPanel'),
      selectors.isElementDisabled(state, 'leftPanel'),
      selectors.getActiveLeftPanel(state),
      selectors.getCustomPanels(state),
      selectors.getLeftPanelWidth(state),
    ],
    shallowEqual,
  );

  const minWidth = 218;
  // const [width, setWidth] = useState(minWidth);
  const dispatch = useDispatch();

  const onDrop = e => {
    // this is mainly for the thumbnail panel, to prevent the broswer from loading a document that dropped in
    e.preventDefault();
  };

  const onDragOver = e => {
    // when dragging over the "LeftPanel", change the cursor to "Move" from "Copy"
    e.preventDefault();
  };

  const getDisplay = panel => (panel === activePanel ? 'flex' : 'none');

  console.log('currentWidth', currentWidth);
  let style = {};
  if (!isMobile) {
    style = { width: `${currentWidth}px`, minWidth: `${currentWidth}px` };
  }

  const isVisible = !(!isOpen || isDisabled);

  let animate = { width: 'auto' };
  if (isMobile) {
    animate = { width: '100vw' };
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={classNames({
            Panel: true,
            LeftPanel: true,
          })}
          onDrop={onDrop}
          onDragOver={onDragOver}
          data-element="leftPanel"
          initial={{ width: '0px' }}
          animate={animate}
          exit={{ width: '0px' }}
          transition={{ ease: "easeOut", duration: 0.25 }}
        >
          <div
            className="left-panel-container"
            style={style}
          >
            {isMobile &&
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
              minWidth={minWidth}
              onResize={_width => {
                dispatch(actions.setLeftPanelWidth(_width));
              }}
            />}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeftPanel;
