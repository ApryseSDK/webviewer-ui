import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import Bookmark from 'components/Bookmark';
import EditingBookmark from 'components/Bookmark/EditingBookmark';
import Icon from 'components/Icon';

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
    const { isDisabled, display, bookmarks, addBookmark } = this.props;

    if (isDisabled) {
      return null;
    }

    let lastPageIndex;

    return (
      <div className="Panel BookmarksPanel" style={{ display }} data-element="bookmarksPanel">
        {
          this.state.isAdding ?
            <EditingBookmark
              label={`PAGE ${core.getCurrentPage()}: NEW BOOKMARK`}
              bookmarkText={''}
              onSave={(bookmarkText) => {
                addBookmark({ pageIndex: core.getCurrentPage() - 1, text: bookmarkText });
                this.setState({ isAdding: false });
              }}
              onCancel={() => {
                this.setState({ isAdding: false });
              }}
            /> :
            <div className='bookmark-header'>
              <div className="whatever">
                <Icon
                  className='icon'
                  glyph='ic_bookmarks_black_24px'
                />
                <div className="bbb">BOOKMARKS</div>
              </div>
              <div
                className="b-btn"
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
        <div className="bm-content">
          {bookmarks.map((bookmark, i) => {
            let showPageLabel = false;
            if (lastPageIndex !== bookmark.pageIndex) {
              showPageLabel = true;
              lastPageIndex = bookmark.pageIndex;
            }

            return (
              <React.Fragment>
                {showPageLabel && <div className="page-label">{`Page ${lastPageIndex + 1}`}</div>}
                <Bookmark key={i} bookmark={bookmark} index={i} />
              </React.Fragment>
            );
          })}
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
