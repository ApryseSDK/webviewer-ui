import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import selectors from 'selectors';

// const mod = (v, n) => {
//   return ((v % n) + n) % n;
// };

class AccessibilityController extends React.PureComponent {
  static propTypes = {
    items: PropTypes.object.isRequired,
  }

  index = 0

  componentDidMount() {
    // document.addEventListener('keydown', e => {
    //   if (e.key === 'Tab' || e.keyCode === 9) {
    //     e.preventDefault();
    //     e.stopPropagation();3
    //     const { items } = this.props;
    //     let element;
    //     do {
    //       const direction = e.shiftKey ? -1 : 1;
    //       console.log('direction', direction);
    //       this.index = mod(this.index + direction, items.length);
    //       console.log('index', this.index);
    //       const { dataElement } = items[this.index];
    //       // console.log(dataElement, items[this.index], this.index);
    //       element = document.querySelector(`*[data-element='${dataElement}']`);
    //       const elements = document.querySelectorAll(`*[tabIndex='0']`);
    //       if (_.isNumber(element.tabIndex)) {
    //         debugger;
    //       }
    //       // if (dataElement === 'zoomOverlayButton') {
    //       //   debugger;
    //       // }
    //     } while (!element);
    //     if (element) {
    //       element.focus();
    //     }
    //   }
    // });
  }

  render() {
    return null;
  }
}

export default connect(
  state => ({
    items: selectors.getVisibleTabableHeaderItems(state),
  }),
)(AccessibilityController);
