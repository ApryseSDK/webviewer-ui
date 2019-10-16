import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import EditingBookmark from 'components/Bookmark/EditingBookmark';

import actions from 'actions';

import core from 'core';

import './bookmark.scss';

class Bookmark extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
    };
  }


  static propTypes = {
    bookmark: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
  }

  render() {
    const { bookmark, editBookmark, removeBookmark, index } = this.props;

    if (this.state.isEditing) {
      return (
        <EditingBookmark
          bookmarkText={bookmark.text}
          onSave={(bookmarkValue) => {
            editBookmark(index, bookmarkValue);
            this.setState({ isEditing: false });
          }}
          onCancel={() => {
            this.setState({ isEditing: false });
          }}
        />
      );
    }

    return (
      <div className="Bookmark">
        <div onClick={() => core.setCurrentPage(bookmark.pageIndex + 1)}>{bookmark.text}</div>
        <div onClick={() => this.setState({ isEditing: true })}>EDIT</div>
        <div onClick={() => removeBookmark(index)}>DELETE</div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  editBookmark: actions.editBookmark,
  removeBookmark: actions.removeBookmark,
};

export default connect(
  null,
  mapDispatchToProps,
)(Bookmark);
