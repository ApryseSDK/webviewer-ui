import React from 'react';
import PropTypes from 'prop-types';

import './EditingBookmark.scss';

class EditingBookmark extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bookmarkText: props.bookmarkText,
    };
  }
  render() {
    const { onSave, onCancel, label } = this.props;

    return (
      <div className="Editing">
        {label && <div className="bm-label">{label}</div>}
        <input
          type="text"
          name="bookmark"
          className="bm-input"
          placeholder="Name"
          value={this.state.bookmarkText}
          onChange={(e) => {
            this.setState({ bookmarkText: e.target.value });
          }}
        />
        <div className="Controls-1">
          <div className="b-btn2 cancel" onClick={onCancel}>
            Cancel
          </div>
          <div className="b-btn2" onClick={() => onSave(this.state.bookmarkText)}>
            Save
          </div>
        </div>
      </div>
    );
  }
}

export default EditingBookmark;
