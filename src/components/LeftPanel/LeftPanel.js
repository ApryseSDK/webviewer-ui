import React from 'react';
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
    closeElement: PropTypes.func.isRequired,
    listMove: PropTypes.func.isRequired
  }

  state = {
    isSliderActive: false
  }

  sliderRef = React.createRef()

  componentDidMount(){
    document.body.style.setProperty('--left-panel-width', '300px');

    // we are using css variables to make the panel resizable but IE11 doesn't support it
    if (!isIE11) {
      this.sliderRef.current.onmousemove = this.dragMouseMove;
      this.sliderRef.current.onmouseup = this.closeDrag;
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen && isTabletOrMobile()) {
      this.props.closeElement('searchPanel');
    }
  }

  // https://github.com/reactjs/rfcs/blob/master/text/0006-static-lifecycle-methods.md#state-derived-from-propsstate
  static getDerivedStateFromProps(nextProps, prevState){
    const hasIsOpenChanged = !prevState.mirroredIsOpen && nextProps.isOpen;
    return { isOpening: hasIsOpenChanged, mirroredIsOpen: nextProps.isOpen };
  }

  getDisplay = panel => {
    return panel === this.props.activePanel ? 'flex' : 'none';
  }

  dragMouseDown = () => {
    this.setState({
      isSliderActive: true
    });
  }

  dragMouseMove = e => {
    if (this.state.isSliderActive && e.clientX > 215 && e.clientX < 900){
      this.sliderRef.current.style.left = (e.clientX) + 'px';
      document.body.style.setProperty('--left-panel-width', (e.clientX)+'px');
    }
  }

  closeDrag = () => {
    this.setState({ isSliderActive: false });
  }

  onKeyDown = e => {
    const { activePanel, listMove } = this.props;
    if (e.key === 'ArrowUp' || e.keyCode === 38) {
      listMove(activePanel, -1);
    } else if (e.key === 'ArrowDown' || e.keyCode === 40) {
      listMove(activePanel, 1);
    }
  }

  render() {
    const { isOpen, isDisabled, closeElement, customPanels } = this.props;

    if (isDisabled) {
      return null;
    }

    const className = getClassName('Panel LeftPanel', this.props);

    return(
      <div
        tabIndex={-1}
        className={className}
        data-element="leftPanel"
        onMouseDown={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
        onKeyDown={this.onKeyDown}
      >
        <div className="left-panel-header">
          <div className="close-btn hide-in-desktop" onClick={() => closeElement('leftPanel')}>
            <Icon glyph="ic_close_black_24px" />
          </div>
          <LeftPanelTabs panelIsOpen={isOpen} />
        </div>

        {!isIE11 &&
          <div
            ref={this.sliderRef}
            className={this.state.isSliderActive ? 'resize-bar active' : 'resize-bar non-active'}
            onMouseDown={this.dragMouseDown}
            onMouseUp={this.closeDrag}
            onMouseMove={this.dragMouseMove}
            onMouseLeave={this.closeDrag}
          />
        }
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

const mapStatesToProps = state => ({
  isOpen: selectors.isElementOpen(state, 'leftPanel'),
  isDisabled: selectors.isElementDisabled(state, 'leftPanel'),
  activePanel: selectors.getActiveLeftPanel(state),
  customPanels: selectors.getCustomPanels(state)
});

const mapDispatchToProps = {
  closeElement: actions.closeElement,
  listMove: actions.listMove,
};

export default connect(mapStatesToProps, mapDispatchToProps)(LeftPanel);
