import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import selectors from 'selectors';

const mod = (v, n) => {
  return ((v % n) + n) % n;
};

class AccessibilityController extends React.PureComponent {
  static propTypes = {
    items: PropTypes.object.isRequired,
  }

  index = 0

  componentDidMount() {
    document.addEventListener('keydown', e => {
      if (e.key === 'Tab' || e.keyCode === 9) {
        e.preventDefault();
        e.stopPropagation();
        const { items } = this.props;
        let element;
        do {
          const { dataElement } = items[this.index];
          console.log(dataElement, items[this.index], this.index);
          element = document.querySelector(`*[data-element='${dataElement}']`);
          this.index = mod(this.index + 1, items.length);
          console.log(this.index);
        } while (!element);
        if (element) {
          element.focus();
        }
      }
    });
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
