import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import HeaderItems from 'components/HeaderItems';

import selectors from 'selectors';
import classNames from 'classnames';

import './Header.scss';

class Header extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    defaultHeaderItems: PropTypes.array.isRequired,
  }

  render() {
    const { isDisabled, defaultHeaderItems, isOpen, isToolsHeaderOpen } = this.props;

    if (isDisabled || !isOpen) {
      return null;
    }

    return (
      <React.Fragment>
        <div
          className={classNames({
            Header: true,
          })}
          data-element="header"
        >
          <HeaderItems items={defaultHeaderItems} />
        </div>
        {!isToolsHeaderOpen && <div className="view-header-border" />}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isToolsHeaderOpen: selectors.isElementOpen(state, 'toolsHeader'),
  isDisabled: selectors.isElementDisabled(state, 'header'),
  isOpen: selectors.isElementOpen(state, 'header'),
  defaultHeaderItems: selectors.getDefaultHeaderItems(state),
});

export default connect(mapStateToProps)(Header);
