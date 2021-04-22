import React from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import ResizeBar from 'components/ResizeBar';
import Icon from 'components/Icon';

import selectors from 'selectors';
import actions from 'actions';
import useMedia from 'hooks/useMedia';

import './SignaturesLeftPanel.scss';

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

  const [currentToolbarGroup, isToolsHeaderOpen,isOpen, isDisabled, currentWidth] = useSelector(
    state => [
      selectors.getCurrentToolbarGroup(state),
      selectors.isElementOpen(state, 'toolsHeader'),
      selectors.isElementOpen(state, 'leftPanel'),
      selectors.isElementDisabled(state, 'leftPanel'),
      selectors.getLeftPanelWidth(state),
    ],
    shallowEqual,
  );

  const minWidth = 264;
  const dispatch = useDispatch();

  const onDrop = e => {
    // this is mainly for the thumbnail panel, to prevent the broswer from loading a document that dropped in
    e.preventDefault();
  };

  const onDragOver = e => {
    // when dragging over the "LeftPanel", change the cursor to "Move" from "Copy"
    e.preventDefault();
  };

 

  let style = {};
  if (!isMobile) {
    style = { width: `${currentWidth}px`, minWidth: `${currentWidth}px` };
  }

  const isVisible = !(!isOpen || isDisabled);

  return (
    <div
      className={classNames({
        Panel: true,
        LeftPanel: true,
        'closed': !isVisible,
        'tools-header-open': isToolsHeaderOpen && currentToolbarGroup !== 'toolbarGroup-View',
      })}
      onDrop={onDrop}
      onDragOver={onDragOver}
      data-element="leftPanel"
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
          </div>
        }

        <div className="d-flex justify-between">
          <div>
            Signatures Pending
          </div>
          <div>
            0/2
          </div>
        </div>
        <div className="divider" />
        <div className="d-flex justify-between mb-2 cursor-pointer">
          <div>
            Page 1
          </div>
          <div className="">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 15.5C3.85775 15.5 0.5 12.1423 0.5 8C0.5 3.85775 3.85775 0.5 8 0.5C12.1423 0.5 15.5 3.85775 15.5 8C15.5 12.1423 12.1423 15.5 8 15.5ZM8 14C9.5913 14 11.1174 13.3679 12.2426 12.2426C13.3679 11.1174 14 9.5913 14 8C14 6.4087 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8C2 9.5913 2.63214 11.1174 3.75736 12.2426C4.88258 13.3679 6.4087 14 8 14Z" fill="currentColor"/>
          </svg>
          </div>
        </div>

        <div className="d-flex justify-between cursor-pointer">
          <div>
            Page 1
          </div>
          <div className="">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 15.5C3.85775 15.5 0.5 12.1423 0.5 8C0.5 3.85775 3.85775 0.5 8 0.5C12.1423 0.5 15.5 3.85775 15.5 8C15.5 12.1423 12.1423 15.5 8 15.5ZM8 14C9.5913 14 11.1174 13.3679 12.2426 12.2426C13.3679 11.1174 14 9.5913 14 8C14 6.4087 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8C2 9.5913 2.63214 11.1174 3.75736 12.2426C4.88258 13.3679 6.4087 14 8 14Z" fill="currentColor"/>
          </svg>
          </div>
        </div>

      </div>
      {!isTabletAndMobile &&
        <ResizeBar
          dataElement="leftPanelResizeBar"
          minWidth={minWidth}
          onResize={_width => {
            dispatch(actions.setLeftPanelWidth(_width));
          }}
        />}
    </div>
  );
};

export default LeftPanel;
