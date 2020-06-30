import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import selectors from 'selectors';

import './Accessibility.scss';

class Accessibility extends React.PureComponent {
  static propTypes = {
    isAccessibleMode: PropTypes.bool,
    isNotesPanelDisabled: PropTypes.bool,
  }

  state = {
    isVisible: false,
  }

  onFocus = () => {
    this.setState({ isVisible: true });
  }

  onBlur = () => {
    this.setState({ isVisible: false });
  }

  render() {
    const { isAccessibleMode, isNotesPanelDisabled } = this.props;
    const { isVisible } = this.state;

    if (!isAccessibleMode) {
      return null;
    }

    const skiptoNotes = isNotesPanelDisabled ? null : <div className="skip-to-notes" onFocus={this.onFocus} onBlur={this.onBlur} tabIndex={0}>Notes</div>;
    const className = `Accessibility ${isVisible ? 'visible' : 'hidden'}`;

    return (
      <div className={className} data-element="accessibility">
        <div>Skip to: </div>
        <input className="skip-to-hack" tabIndex={-1}></input>
        <div className="skip-to-document" onFocus={this.onFocus} onBlur={this.onBlur} tabIndex={0}>Document</div>
        {skiptoNotes}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAccessibleMode: selectors.isAccessibleMode(state),
  isNotesPanelDisabled: selectors.isElementDisabled(state, 'notesPanel')
});

export default connect(mapStateToProps)(Accessibility);