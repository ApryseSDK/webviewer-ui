import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import classNames from 'classnames';
import { withTranslation } from 'react-i18next';
import Icon from 'components/Icon';

import './Dropdown.scss';

class Dropdown extends React.PureComponent {
  static propTypes = {
    onClickItem: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    currentSelectionKey: PropTypes.string.isRequired,
    translationPrefix: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {
      isOpen: false,
      itemsWidth: 94,
    };
  }

  toggleDropdown = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  onClickDropdownItem = (e, key) => {
    const { onClickItem } = this.props;

    e.stopPropagation();

    onClickItem(key);
    this.setState({
      isOpen: false,
    });
  }

  handleClickOutside = e => {
    this.setState({
      isOpen: false,
    });
  }

  renderDropdownItems = () => {
    const { items, currentSelectionKey, translationPrefix } = this.props;

    return items.map(key =>
      <button
        key={key}
        className={classNames({
          "dropdown-item": true,
          active: key === currentSelectionKey,
        })}
        onClick={e => this.onClickDropdownItem(e, key)}
      >
        {this.props.t(`${translationPrefix}.${key}`)}
      </button>,
    );
  }

  render() {
    const {
      isOpen,
      itemsWidth,
    } = this.state;

    const {
      items,
      currentSelectionKey,
      translationPrefix,
    } = this.props;

    const selectedItem = items.find(key => key === currentSelectionKey);

    return (
      <button
        className="Dropdown"
        style={{ width: `${itemsWidth + 2}px` }}
        data-element="dropdown"
        onClick={this.toggleDropdown}
      >
        <div
          className="picked-option"
        >
          {selectedItem &&
            <div
              className="picked-option-text"
            >
              {this.props.t(`${translationPrefix}.${currentSelectionKey}`)}
            </div>
          }
          <Icon className="down-arrow" glyph="icon-chevron-down" />
        </div>
        <div
          className={classNames({
            "dropdown-items": true,
            "hide": !isOpen,
          })}
          ref={ele => {
            if (ele) {
              this.setState({ itemsWidth: ele.clientWidth });
            }
          }}
        >
          {this.renderDropdownItems()}
        </div>
      </button>
    );
  }
}

export default withTranslation()(onClickOutside(Dropdown));
