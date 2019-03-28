import React from 'react';
import { connect } from 'react-redux';

import Button from 'components/Button';
import ResponsiveOverlay from 'components/ResponsiveOverlay';
import HeaderItems from 'components/HeaderItems';

import actions from 'actions';

import Portal from 'src/Portal';

import "./ResponsiveButton.scss";

class ResponsiveButton extends React.PureComponent {

  componentWillMount() {
    this.setState({ isCollapsed: false, isOverlayOpen: false });
  }
  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  onResize = () => {
    if (this.state.isCollapsed !== window.innerWidth <= this.props.maxWidth){
      this.setState({ isOverlayOpen: false });
    }
    this.setState({
      isCollapsed: window.innerWidth <= this.props.maxWidth
    })
  }

  toggleOverlay = () => {
    const { closeElement } = this.props;
    closeElement('toolStylePopup');
    this.setState({ isOverlayOpen: !this.state.isOverlayOpen });
  }

  onClick = () => {
    const { closeElement } = this.props;
    closeElement('toolStylePopup');
    this.setState({
      isOverlayOpen: !this.state.isOverlayOpen
    });
  };

  render() { 
    let { children } = this.props;
    const { isCollapsed, isOverlayOpen } = this.state;
    if (!children) {
      return null;
    }

    return (
      <React.Fragment>
        { 
          isCollapsed ? 
          <Button { ...this.props } onClick={this.onClick} /> :
          <div className="innerHeaderItems">
            <HeaderItems items={children} { ...this.props } />
          </div>
        }
        { 
          isOverlayOpen && 
          <Portal>
            <ResponsiveOverlay children={children} { ...this.props } toggleOverlay = { this.toggleOverlay } />
          </Portal>
        }

      </React.Fragment>
    );
  }
}
 
const mapStateToProps = () => ({
});

const mapDispatchToProps = {
  closeElement: actions.closeElement
};

export default connect(mapStateToProps, mapDispatchToProps)(ResponsiveButton);