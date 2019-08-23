import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LeftPanelTabs from 'components/LeftPanelTabs';
import NotesPanel from 'components/NotesPanel';
import ThumbnailsPanel from 'components/ThumbnailsPanel';
import OutlinesPanel from 'components/OutlinesPanel';
import CustomElement from 'components/CustomElement';
import Icon from 'components/Icon';

import { isTabletOrMobile, isIE, isIE11 } from 'helpers/device';
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
    closeElement: PropTypes.func.isRequired,
    setLeftPanelWidth: PropTypes.func,
    leftPanelWidth: PropTypes.number
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen && isTabletOrMobile()) {
      this.props.closeElement('searchPanel');
    }
  }

  getDisplay = panel => {
    return panel === this.props.activePanel ? 'flex' : 'none';
  };

  onWidthChange = width => {
    if (isIE) {
      // for IE11 we need to manaully set the left panel because CSS variables aren't supported
      // for Edge, we need to manually resize it to cause the main document container to resize 
      this.props.setLeftPanelWidth(width);
    }
  }

  render() {
    const { isDisabled, closeElement, customPanels, leftPanelWidth } = this.props;
    if (isDisabled) {
      return null;
    }

    // IE11 will use javascript for controlling width, other broswers will use CSS
    const style = isIE11 && leftPanelWidth ? { width: leftPanelWidth } : { };

    const className = getClassName('Panel LeftPanel', this.props);

    return (
      <div
        className={className}
        data-element="leftPanel"
        onMouseDown={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
        style={style}
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

        <ResizeBar onWidthChange={this.onWidthChange} />

        <NotesPanel display={this.getDisplay('notesPanel')} />
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

const ResizeBar = props => {
  const isMouseDownRef = useRef(false);

  useEffect(() => {
    const dragMouseMove = ({ clientX }) => {
      if (isMouseDownRef.current && clientX > 215 && clientX < 900) {
        props.onWidthChange(clientX);
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
    <div
      className="resize-bar"
      onMouseDown={() => isMouseDownRef.current = true}
    />
  );
};

ResizeBar.propTypes = {
  onWidthChange: PropTypes.func.isRequired
};

const mapStatesToProps = state => ({
  isOpen: selectors.isElementOpen(state, 'leftPanel'),
  isDisabled: selectors.isElementDisabled(state, 'leftPanel'),
  activePanel: selectors.getActiveLeftPanel(state),
  customPanels: selectors.getCustomPanels(state),
  leftPanelWidth: selectors.getLeftPanelWidth(state)
});

const mapDispatchToProps = {
  closeElement: actions.closeElement,
  setLeftPanelWidth: actions.setLeftPanelWidth
};

export default connect(
  mapStatesToProps,
  mapDispatchToProps
)(LeftPanel);
