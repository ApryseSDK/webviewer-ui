import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import actions from 'actions';

import core from 'core';

import './bookmark.scss';

class Bookmark extends React.PureComponent {
  static propTypes = {
    bookmark: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
  }

  render() {
    const { bookmark, editBookmark, removeBookmark, index } = this.props;

    return (
      <div className="Bookmark">
        <div onClick={() => core.setCurrentPage(bookmark.pageIndex + 1)}>{bookmark.text}</div>
        {/* <div onClick={() => editBookmark()}>EDIT</div> */}
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
