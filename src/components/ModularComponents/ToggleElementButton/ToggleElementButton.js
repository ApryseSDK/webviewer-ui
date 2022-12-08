import React from 'react';
import selectors from 'selectors';
import actions from 'actions';
import PropTypes from 'prop-types';
import './ToggleElementButton.scss';
import Item from 'components/ModularComponents/Item';
import { connect } from 'react-redux';
import Tooltip from 'components/Tooltip';
import Icon from 'components/Icon';
import classNames from 'classnames';

class ToggleElementButton extends Item {
  static propTypes = {
    icon: PropTypes.string,
    toggleElement: PropTypes.string,
    disabled: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { toggleElement, isActive, closeElement, openElement } = this.props;
    if (isActive) {
      closeElement(toggleElement);
    } else {
      openElement(toggleElement);
    }
  }

  render() {
    const { isActive, icon, title, dataElement, disabled } = this.props;
    const isDataUrl = icon && icon.indexOf('data:') === 0;
    const displayIcon = isDataUrl ? <img src={icon} /> : <Icon glyph={icon}/>;
    return (
      <div className='ToggleElementButton' data-element={dataElement}>
        <Tooltip content={title}>
          <button disabled={disabled} className={classNames('Button', { isActive })}
            onClick={this.onClick} type='button'>
            {displayIcon}
          </button>
        </Tooltip>
      </div>
    );
  }
}

ToggleElementButton.propTypes = {
  ...ToggleElementButton.prototype.propTypes,
  isActive: PropTypes.bool,
  closeElement: PropTypes.func,
  openElement: PropTypes.func,
};

const mapStateToProps = (state, props) => ({
  isActive: selectors.isElementOpen(state, props.toggleElement),
});

const mapDispatchToProps = {
  closeElement: actions.closeElement,
  openElement: actions.openElement,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToggleElementButton);
