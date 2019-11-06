/* eslint-disable lines-between-class-members */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import Bookmark from 'components/Bookmark';
import EditingBookmark from 'components/Bookmark/EditingBookmark';
import Icon from 'components/Icon';

import actions from 'actions';
import selectors from 'selectors';

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
    currentPage: PropTypes.number.isRequired,
    isDisabled: PropTypes.bool,
  }
  render() {
    const { isDisabled, display, bookmarks, addBookmark, currentPage } = this.props;

    if (isDisabled) {
      return null;
    }

    const pageIndexes = Object.keys(bookmarks).map(pageIndex => parseInt(pageIndex, 10));
    return (
      <div className="Panel bookmarks-panel" style={{ display }} data-element="bookmarksPanel">
        {
          this.state.isAdding ?
            <EditingBookmark
              label={`PAGE ${currentPage}: NEW BOOKMARK`}
              bookmarkText={''}
              onSave={newText => {
                addBookmark(currentPage - 1, newText);
                this.setState({ isAdding: false });
              }}
              onCancel={() => {
                this.setState({ isAdding: false });
              }}
            /> :
            <div className="bookmark-header">
              <div className="whatever">
                <Icon
                  className="icon"
                  glyph="ic_bookmarks_black_24px"
                />
                <div className="label">BOOKMARKS</div>
              </div>
              <div
                className="new-bookmark-btn"
                onClick={() => {
                  this.setState({ isAdding: true });
                }}
                tabIndex={0}
                role="button"
              >
                New Bookmark
              </div>
            </div>
        }
        <div className="bookmark-row">
          {pageIndexes.map(pageIndex => (
            <>
              <div className="page-label">{`Page ${pageIndex + 1}`}</div>
              <Bookmark text={bookmarks[pageIndex]} pageIndex={pageIndex} />
            </>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  bookmarks: selectors.getBookmarks(state),
  isDisabled: selectors.isElementDisabled(state, 'bookmarksPanel'),
  currentPage: selectors.getCurrentPage(state),
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
