import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LeftPanelTabs from 'components/LeftPanelTabs';
import NotesPanel from 'components/NotesPanel';
import ThumbnailsPanel from 'components/ThumbnailsPanel';
import OutlinesPanel from 'components/OutlinesPanel';
import CustomElement from 'components/CustomElement';
import Icon from 'components/Icon';

import { isTabletOrMobile, isIE11 } from 'helpers/device';
import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';

import './LeftPanel.scss';

class LeftPanel extends React.Component {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    customPanels: PropTypes.array.isRequired,
    activePanel: PropTypes.string.isRequired,
    closeElement: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen && isTabletOrMobile()) {
      this.props.closeElement('searchPanel');
    }
  }

  getDisplay = panel => {
    return panel === this.props.activePanel ? 'flex' : 'none';
  };

  render() {
    const { isDisabled, closeElement, customPanels, isOpen } = this.props;

    if (isDisabled) {
      return null;
    }

    const className = getClassName('Panel LeftPanel', this.props);

    return (
      <div
        className={className}
        data-element="leftPanel"
        onMouseDown={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
      >
        <div className="left-panel-header">
          <div
            className="close-btn hide-in-desktop"
            onClick={() => closeElement('leftPanel')}
          >
            <Icon glyph="ic_close_black_24px" />
          </div>
          <LeftPanelTabs />
        </div>

        <ResizeBar />

        <NotesPanel
          isLeftPanelOpen={isOpen}
          display={this.getDisplay('notesPanel')}
        />
        <ThumbnailsPanel display={this.getDisplay('thumbnailsPanel')} />
        <OutlinesPanel display={this.getDisplay('outlinesPanel')} />
        {customPanels.map(({ panel }, index) => (
          <CustomElement
            key={panel.dataElement || index}
            className={`Panel ${panel.dataElement}`}
            display={this.getDisplay(panel.dataElement)}
            dataElement={panel.dataElement}
            render={panel.render}
          />
        ))}
      </div>
    );
  }
}

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

const mapStatesToProps = state => ({
  isOpen: selectors.isElementOpen(state, 'leftPanel'),
  isDisabled: selectors.isElementDisabled(state, 'leftPanel'),
  activePanel: selectors.getActiveLeftPanel(state),
  customPanels: selectors.getCustomPanels(state)
});

const mapDispatchToProps = {
  closeElement: actions.closeElement
};

export default connect(
  mapStatesToProps,
  mapDispatchToProps
)(LeftPanel);
