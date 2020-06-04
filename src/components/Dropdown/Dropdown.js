import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Icon from 'components/Icon';

import actions from 'actions';
import selectors from 'selectors';

import './Dropdown.scss';

class Dropdown extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    sortStrategy: PropTypes.string.isRequired,
    setSortStrategy: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    t: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = { isOpen: false };
    this.sortStrategyToTranslationMap = {
      position: 'option.notesPanel.orderPosition',
      time: 'option.notesPanel.orderTime',
    };
  }

  toggleDropdown = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  onClickDropdown = (e, item) => {
    e.stopPropagation();

    this.props.setSortStrategy(item);
    this.setState({ isOpen: false });
  }

  getTranslatedContent = sortStrategy => this.props.t(this.sortStrategyToTranslationMap[sortStrategy]) || sortStrategy;

  renderDropdownItems = () => {
    const { sortStrategy, items } = this.props;
    const dropdownItems = items.filter(item => item !== sortStrategy);

    return dropdownItems.map(item =>
      <div key={item} className="dropdown-item" onClick={e => this.onClickDropdown(e, item)}>
        {this.getTranslatedContent(item)}
      </div>,
    );
  }

  render() {
    const { isDisabled, sortStrategy } = this.props;

    if (isDisabled) {
      return null;
    }

    return (
      <div className="old-dropdown" data-element="dropdown" onClick={this.toggleDropdown}>
        <div className="picked-option">
          {this.getTranslatedContent(sortStrategy)}
          <Icon className="down-arrow" glyph="icon-chevron-down" />
        </div>
        <div className={`dropdown-items ${this.state.isOpen ? 'show' : 'hide'}`}>
          {this.renderDropdownItems()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'dropdown'),
  sortStrategy: selectors.getSortStrategy(state),
});

const mapDispatchToProps = {
  setSortStrategy: actions.setSortStrategy,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Dropdown));
