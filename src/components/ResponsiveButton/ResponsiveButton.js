import React from 'react';

import Button from 'components/Button';
import ResponsiveOverlay from 'components/ResponsiveOverlay';
import HeaderItems from 'components/HeaderItems';

import Portal from 'src/Portal';

class ResponsiveButton extends React.PureComponent {

  componentWillMount() {
    this.state = { isCollapsed: false, isOverlayOpen: false };
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
    this.setState({ isOverlayOpen: !this.state.isOverlayOpen });
  }

  onClick = () => {
    this.setState({
      isOverlayOpen: !this.state.isOverlayOpen
    });
  };

  render() { 
    let { children } = this.props;
    const { isCollapsed, isOverlayOpen } = this.state;
    let headerChildren = children.slice(0)
    headerChildren.unshift({ type: 'spacer' });
    return (
      <React.Fragment>
        { isCollapsed ? 
          <Button { ...this.props } onClick={this.onClick} /> :
          <HeaderItems items={headerChildren} { ...this.props } />
        }
        { isOverlayOpen && 
          <Portal>
            <ResponsiveOverlay children={children} { ...this.props } toggleOverlay = { this.toggleOverlay } />
          </Portal>
        }

      </React.Fragment>
    );
  }
}
 
export default ResponsiveButton;