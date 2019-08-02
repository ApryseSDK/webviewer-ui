import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import LeftPanelTabs from 'components/LeftPanelTabs';
import NotesPanel from 'components/NotesPanel';
import ThumbnailsPanel from 'components/ThumbnailsPanel';
import OutlinesPanel from 'components/OutlinesPanel';
import CustomElement from 'components/CustomElement';
import Icon from 'components/Icon';

import { isTabletOrMobile, isIE11 } from 'helpers/device';
import actions from 'actions';
import selectors from 'selectors';

import './LeftPanel.scss';

const LeftPanel = () => {
  const isDisabled = useSelector(state =>
    selectors.isElementDisabled(state, 'leftPanel')
  );
  const isOpen = useSelector(state =>
    selectors.isElementOpen(state, 'leftPanel')
  );
  const activePanel = useSelector(state => selectors.getActiveLeftPanel(state));
  const customPanels = useSelector(state => selectors.getCustomPanels(state));
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen && isTabletOrMobile()) {
      dispatch(actions.closeElement('searchPanel'));
    }
  }, [isOpen]);

  const getDisplay = panel => {
    return panel === activePanel ? 'flex' : 'none';
  };

  return isDisabled ? null : (
    <div
      className={classNames({
        Panel: true,
        LeftPanel: true,
        open: isOpen,
        closed: !isOpen
      })}
      data-element="leftPanel"
      onMouseDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
    >
      <div className="left-panel-header">
        <div
          className="close-btn hide-in-desktop"
          onClick={() => dispatch(actions.closeElement('leftPanel'))}
        >
          <Icon glyph="ic_close_black_24px" />
        </div>
        <LeftPanelTabs />
      </div>

      <ResizeBar />

      <NotesPanel display={getDisplay('notesPanel')} />
      <ThumbnailsPanel display={getDisplay('thumbnailsPanel')} />
      <OutlinesPanel display={getDisplay('outlinesPanel')} />
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
  );
};

export default LeftPanel;

const ResizeBar = () => {
  const isMouseDownRef = useRef(false);

  useEffect(() => {
    const dragMouseMove = ({ clientX }) => {
      if (isMouseDownRef.current && clientX > 215 && clientX < 900) {
        document.body.style.setProperty('--left-panel-width', `${clientX}px`);
      }
    };

    document.addEventListener('mousemove', dragMouseMove);
    return () => document.removeEventListener('mousemove', dragMouseMove);
  }, []);

  useEffect(() => {
    const finishDrag = () => {
      isMouseDownRef.current = false;
    };

    document.addEventListener('mouseup', finishDrag);
    return () => document.removeEventListener('mouseup', finishDrag);
  }, []);

  // we are using css variables to make the panel resizable but IE11 doesn't support it
  return (
    !isIE11 && (
      <div
        className="resize-bar"
        onMouseDown={() => (isMouseDownRef.current = true)}
      />
    )
  );
};
