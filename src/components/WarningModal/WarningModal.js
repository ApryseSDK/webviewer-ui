import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import core from 'core';

import Button from 'components/Button';

import getClassName from 'helpers/getClassName';
import getPopupElements from 'helpers/getPopupElements';

import actions from 'actions';
import selectors from 'selectors';

import { Swipeable } from 'react-swipeable';

import './WarningModal.scss';

class WarningModal extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    closeElement: PropTypes.func.isRequired,
    closeElements: PropTypes.func.isRequired,

    confirmBtnText: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
  };

  componentDidMount() {
    core.addEventListener('documentUnloaded', this.onCancel);
  }

  componentDidUpdate(prevProps) {
    const { isOpen, closeElements } = this.props;

    // if (!prevProps.isOpen && isOpen) {
    //   closeElements(getPopupElements());
    // }
  }

  componentWillUnmount() {
    core.removeEventListener('documentUnloaded', this.onCancel);
  }

  onCancel = () => {
    // fire cancel event from 'componentDidUpdate'
    if (this.props.onCancel) {
      this.props.onCancel().then(() => {
        this.props.closeElement('warningModal');
      });
    } else {
      this.props.closeElement('warningModal');
    }
  };

  onConfirm = () => {
    this.props.onConfirm().then(() => {
      this.props.closeElement('warningModal');
    });
  };

  render() {
    const { title, message, confirmBtnText } = this.props;

    if (this.props.isDisabled) {
      return null;
    }

    const className = getClassName('Modal WarningModal', this.props);
    const label = confirmBtnText || i18next.t('action.ok');

    const cancelBtnText = i18next.t('action.cancel');

    return (
      <Swipeable
        onSwipedUp={this.onCancel}
        onSwipedDown={this.onCancel}
        preventDefaultTouchmoveEvent
      >
        <div className={className} onMouseDown={this.onCancel}>
          <div className="container" onMouseDown={e => e.stopPropagation()}>
            <div className="swipe-indicator" />
            <div className="header">{title}</div>
            <div className="body">{message}</div>
            <div className="footer">
              <Button
                className="cancel modal-button"
                dataElement="WarningModalClearButton"
                label={cancelBtnText}
                onClick={this.onCancel}
              />
              <Button
                className="confirm modal-button"
                dataElement="WarningModalSignButton"
                label={label}
                onClick={this.onConfirm}
              />
            </div>
          </div>
        </div>
      </Swipeable>
    );
  }
}

const mapStateToProps = state => ({
  title: selectors.getWarningTitle(state) || '',
  message: selectors.getWarningMessage(state),
  onConfirm: selectors.getWarningConfirmEvent(state),
  confirmBtnText: selectors.getWarningConfirmBtnText(state),
  onCancel: selectors.getWarningCancelEvent(state),
  isDisabled: selectors.isElementDisabled(state, 'warningModal'),
  isOpen: selectors.isElementOpen(state, 'warningModal'),
});

const mapDispatchToProps = {
  closeElement: actions.closeElement,
  closeElements: actions.closeElements,
};

export default connect(mapStateToProps, mapDispatchToProps)(WarningModal);
