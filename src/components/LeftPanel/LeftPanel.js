import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector, shallowEqual } from 'react-redux';

import LeftPanelTabs from 'components/LeftPanelTabs';
import NotesPanel from 'components/NotesPanel';
import ThumbnailsPanel from 'components/ThumbnailsPanel';
import OutlinesPanel from 'components/OutlinesPanel';
import BookmarksPanel from 'components/BookmarksPanel';
import LayersPanel from 'components/LayersPanel';
import CustomElement from 'components/CustomElement';

import { isIE11 } from 'helpers/device';
import selectors from 'selectors';

import './LeftPanel.scss';

const LeftPanel = () => {
  const [isDisabled, isOpen, activePanel, customPanels, leftPanelWidth] = useSelector(
    state => [
      selectors.isElementDisabled(state, 'leftPanel'),
      selectors.isElementOpen(state, 'leftPanel'),
      selectors.getActiveLeftPanel(state),
      selectors.getCustomPanels(state),
      selectors.getLeftPanelWidth(state),
    ],
    shallowEqual,
  );

  const onDrop = e => {
    // this is mainly for the thumbnail panel, to prevent the broswer from loading a document that dropped in
    e.preventDefault();
  };

  const onDragOver = e => {
    // when dragging over the "LeftPanel", change the cursor to "Move" from "Copy"
    e.preventDefault();
  };

  const getDisplay = panel => (panel === activePanel ? 'flex' : 'none');
  // IE11 will use javascript for controlling width, other broswers will use CSS variables
  const style = isIE11 && leftPanelWidth ? { width: leftPanelWidth } : { };

  return isDisabled ? null : (
    <div
      className={classNames({
        Panel: true,
        LeftPanel: true,
        open: true,
        closed: false,
      })}
      onDrop={onDrop}
      onDragOver={onDragOver}
      data-element="leftPanel"
      style={style}
    >
      <div className="left-panel-header">
        <LeftPanelTabs />
      </div>

      <ErrorBoundary>
        <NotesPanel display={getDisplay('notesPanel')} />
      </ErrorBoundary>
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
  );
};

export default LeftPanel;

class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.element,
  }

  static getDerivedStateFromError(error) {
    console.error(error);
    return { hasError: true };
  }

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}