import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import Bookmark from 'components/Bookmark';
import EditingBookmark from 'components/Bookmark/EditingBookmark';

import actions from 'actions';
import selectors from 'selectors';

import core from 'core';

import './BookmarksPanel.scss';

class BookmarksPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAdding: false,
    };
  }

  static propTypes = {
    bookmarks: PropTypes.arrayOf(PropTypes.object),
    addBookmark: PropTypes.func.isRequired,
    display: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
  }

  render() {
    const { isDisabled, display, bookmarks, addBookmark, editBookmark, removeBookmark } = this.props;

    if (isDisabled) {
      return null;
    }

    return (
      <div className="Panel BookmarksPanel" style={{ display }} data-element="bookmarksPanel">
        {
          this.state.isAdding ?
            <EditingBookmark
              bookmarkText={''}
              editBookmark={editBookmark}
              removeBookmark={removeBookmark}
              onSave={(bookmarkText) => {
                addBookmark({ pageIndex: core.getCurrentPage() - 1, text: bookmarkText });
                this.setState({ isAdding: false });
              }}
              onCancel={() => {
                this.setState({ isAdding: false });
              }}
            /> :
            <div>
              <div onClick={() => {
                this.setState({ isAdding: true });
              }}>
                ADD BOOKMARK
              </div>
            </div>
        }
        <div>
          {bookmarks.map((bookmark, i) => (
            <Bookmark key={i} bookmark={bookmark} index={i} />
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  bookmarks: selectors.getBookmarks(state),
  isDisabled: selectors.isElementDisabled(state, 'bookmarksPanel')
});

const mapDispatchToProps = {
  addBookmark: actions.addBookmark,
  editBookmark: actions.editBookmark,
  removeBookmark: actions.removeBookmark,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(BookmarksPanel));
