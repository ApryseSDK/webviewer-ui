import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Button from 'components/Button';

import core from 'core';
import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';

import './PasswordModal.scss';

class PasswordModal extends React.PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool,
    checkPassword: PropTypes.func,
    t: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.maxAttempts = 3;
    this.passwordInput = React.createRef();
    this.state = {
      attempt: 0,
      password: '',
      userCanceled: false
    };
  }

  componentDidMount() {
    core.addEventListener('beforeDocumentLoaded', this.onBeforeDocumentLoaded);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElement('loadingModal');
    }
    if (this.passwordInput.current) {
      this.passwordInput.current.focus();
    }
  }

  componentWillUnmount() {
    core.removeEventListener('beforeDocumentLoaded', this.onBeforeDocumentLoaded);
  }

  onBeforeDocumentLoaded = () => {
    this.setState({
      attempt: 0
    });
  }

  handleInputChange = e => {
    this.setState({ password: e.target.value });
  }

  handleSubmit = e => {
    e.preventDefault();

    const { checkPassword, closeElement } = this.props;

    this.setState(prevState => ({ 
      attempt: prevState.attempt + 1,
      password: ''
    }));
    checkPassword(this.state.password);
    closeElement('passwordModal');
  }

  handleCancel = () => {
    this.setState({ userCanceled: true });
  }

  renderContent = () => {
    const userExceedsMaxAttempts = this.state.attempt === this.maxAttempts;

    if (userExceedsMaxAttempts) {
      return this.renderMaxAttemptsContent();
    }
    if (this.state.userCanceled) {
      return this.renderUserCancelContent();
    }

    return this.renderEnterPasswordContent();
  }

  renderMaxAttemptsContent = () => {
    return <p>{this.props.t('message.encryptedAttemptsExceeded')}</p>;
  }

  renderUserCancelContent = () => {
    return <p>{this.props.t('message.encryptedUserCancelled')}</p>;
  }

  renderEnterPasswordContent = () => {
    const { t } = this.props;
    const wrongPassword = this.state.attempt !== 0;

    return (
      <div className="wrapper">
        <div className="header">{t('message.passwordRequired')}</div>
        <form onSubmit={this.handleSubmit}>
          <div className="enter">
            <div>{t('message.enterPassword')}</div>
            <input
              className={`${wrongPassword ? 'wrong' : 'correct'}`}
              type="password"
              ref={this.passwordInput}
              value={this.state.password}
              onChange={this.handleInputChange}
            />
          </div>
          {wrongPassword &&
            <div className="incorrect-password">
              {t('message.incorrectPassword', { 
                remainingAttempts: this.maxAttempts - this.state.attempt
              })}
            </div>
          }
          <div className="buttons">
            <Button
              dataElement="passwordSubmitButton"
              label={t('action.submit')}
              onClick={this.handleSubmit}
            />
            <Button
              dataElement="passwordCancelButton"
              label={t('action.cancel')}
              onClick={this.handleCancel}
            />
          </div>
        </form>
      </div>
    );
  }

  render() {
    const className = getClassName('Modal PasswordModal', this.props);

    return (
      <div className={className} data-element="passwordModal">
        <div className="container">
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isOpen: selectors.isElementOpen(state, 'passwordModal'),
  checkPassword: selectors.getCheckPasswordFunction(state)
});

const mapDispatchToProps = {
  closeElement: actions.closeElement
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PasswordModal));