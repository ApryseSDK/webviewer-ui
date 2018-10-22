import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LeftPanelTabs from 'components/LeftPanelTabs';
import NotesPanel from 'components/NotesPanel';
import ThumbnailsPanel from 'components/ThumbnailsPanel';
import OutlinesPanel from 'components/OutlinesPanel';
import Icon from 'components/Icon';

import { isTabletOrMobile } from 'helpers/device';
import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';

import './LeftPanel.scss';

class LeftPanel extends React.Component {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    activePanel: PropTypes.string.isRequired,
    closeElement: PropTypes.func.isRequired
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen && isTabletOrMobile()) {
      this.props.closeElement('searchPanel');
    }
  }

  getDisplay = panel => {
    return panel === this.props.activePanel ? 'flex' : 'none';
  }

  render() {
    const { isDisabled, closeElement } = this.props;
    
    if (isDisabled) {
      return null;
    }
    
    const className = getClassName('Panel LeftPanel', this.props);

    return(
      <div className={className} data-element="leftPanel" onMouseDown={e => e.stopPropagation()} onClick={e => e.stopPropagation()}>
        <div className="left-panel-header">
          <div className="close-btn hide-in-desktop hide-in-tablet" onClick={() => closeElement('leftPanel')}>
            <Icon glyph="ic_close_black_24px" />
          </div>
          <LeftPanelTabs />
        </div>
        
        <NotesPanel display={this.getDisplay('notesPanel')} />
        <ThumbnailsPanel display={this.getDisplay('thumbnailsPanel')} />
        <OutlinesPanel display={this.getDisplay('outlinesPanel')} /> 
      </div>
    );
  }
}

const mapStatesToProps = state => ({
  isOpen: selectors.isElementOpen(state, 'leftPanel'),
  isDisabled: selectors.isElementDisabled(state, 'leftPanel'),
  activePanel: selectors.getActiveLeftPanel(state)
});

const mapDispatchToProps = {
  closeElement: actions.closeElement,
};

export default connect(mapStatesToProps, mapDispatchToProps)(LeftPanel);