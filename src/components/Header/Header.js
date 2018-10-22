import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import HeaderItems from 'components/HeaderItems';

import getClassName from 'helpers/getClassName';
import selectors from 'selectors';

import './Header.scss';

class Header extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    activeHeaderItems: PropTypes.array.isRequired
  }

  render() {
    const { isDisabled, activeHeaderItems } = this.props;
    const className = getClassName('Header', this.props);

    if (isDisabled) {
      return null;
    }

    return (
      <div className={className} data-element="header" onMouseDown={e => e.stopPropagation()}>
        <HeaderItems items={activeHeaderItems} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'header'),
  isOpen: selectors.isElementOpen(state, 'header'),
  activeHeaderItems: selectors.getActiveHeaderItems(state),
});

export default connect(mapStateToProps)(Header);