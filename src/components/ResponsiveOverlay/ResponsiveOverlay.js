import React from 'react';

import HeaderItems from 'components/HeaderItems';
import ActionButton from 'components/ActionButton';

import './ResponsiveOverlay.scss';

class ResponsiveOverlay extends React.PureComponent {
  render() { 
    const { children } = this.props;
    return (
      <div className="ResponsiveOverlay">
        <HeaderItems items={children} { ...this.props } />
        <ActionButton img='ic_close_black_24px' title='action.close' onClick={this.props.toggleOverlay}/>
      </div>
    );
  }
}
 
export default ResponsiveOverlay;