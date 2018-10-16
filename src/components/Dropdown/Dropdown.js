import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import actions from 'actions';
import selectors from 'selectors';

import './Dropdown.scss';

class Dropdown extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    sortNotesBy: PropTypes.string.isRequired,
    setSortNotesBy: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    t: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.state = { isOpen: false };  
    this.sortOrderToTranslationMap = {
      position: 'option.notesPanel.orderPosition',
      time: 'option.notesPanel.orderTime'
    };
  }

  toggleDropdown = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }
  
  handleDisplayItemChange = (e, item) => {
    e.stopPropagation();
    
    this.props.setSortNotesBy(item);
    this.setState({ isOpen: false });
  }
  
  getTranslatedContent = sortNotesBy => this.props.t(this.sortOrderToTranslationMap[sortNotesBy]) || sortNotesBy;

  renderDropdownItems = () => {
    const { sortNotesBy, items } = this.props;
    const dropdownItems = items.filter(item => item !== sortNotesBy);

    return dropdownItems.map(item => 
      <div key={item} className="dropdown-item" onClick={e => this.handleDisplayItemChange(e, item)}>
        {this.getTranslatedContent(item)}
      </div>
    );
  }

  render() {
    const { isDisabled, sortNotesBy } = this.props;

    if (isDisabled) {
      return null;
    }

    return(
      <div className="Dropdown" data-element="dropdown" onClick={this.toggleDropdown}> 
        <div className="items">
          <div className="display-item">{this.getTranslatedContent(sortNotesBy)}</div>
          <div className={`dropdown-items ${this.state.isOpen ? 'show' : 'hide'}`}>
            {this.renderDropdownItems()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'dropdown'),
  sortNotesBy: selectors.getSortNotesBy(state)
});

const mapDispatchToProps = {
  setSortNotesBy: actions.setSortNotesBy
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Dropdown));