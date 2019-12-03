import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import './EditingBookmark.scss';

class EditingBookmark extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bookmarkText: props.bookmarkText,
    };
  }

  static propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    bookmarkText: PropTypes.string.isRequired,
  }

  render() {
    const { onSave, onCancel, label, t } = this.props;

    return (
      <div className="editing-bookmark">
        {label && <div className="editing-label">{label}</div>}
        <input
          type="text"
          name="bookmark"
          className="editing-input"
          placeholder="Name"
          value={this.state.bookmarkText}
          onChange={e => {
            this.setState({ bookmarkText: e.target.value });
          }}
        />
        <div className="editing-controls">
          <div className="editing-button editing-pad" onClick={onCancel}>
            {t('action.cancel')}
          </div>
          <div className="editing-button" onClick={() => onSave(this.state.bookmarkText)}>
            {t('action.save')}
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(EditingBookmark);
