import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import HeaderItems from 'components/HeaderItems';

import getClassName from 'helpers/getClassName';
import selectors from 'selectors';
import classNames from 'classnames';

import './Header.scss';

class Header extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    activeHeaderItems: PropTypes.array.isRequired,
  }

  render() {
    const { isDisabled, activeHeaderItems, isOpen, isToolsHeaderOpen } = this.props;
    // const className = getClassName('Header', this.props);

    if (isDisabled || !isOpen) {
      return null;
    }

    return (
      <div>
        <div
          className={classNames({
            Header: true,
          })}
          data-element="header"
        >
          <HeaderItems items={activeHeaderItems} />
        </div>
        {!isToolsHeaderOpen && <div className="view-header-border" />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isToolsHeaderOpen: selectors.isElementOpen(state, 'toolsHeader'),
  isDisabled: selectors.isElementDisabled(state, 'header'),
  isOpen: selectors.isElementOpen(state, 'header'),
  activeHeaderItems: selectors.getActiveHeaderItems(state),
});

export default connect(mapStateToProps)(Header);
