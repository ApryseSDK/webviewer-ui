import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import Bookmark from 'components/Bookmark';

import actions from 'actions';
import selectors from 'selectors';

import core from 'core';

import './BookmarksPanel.scss';

class BookmarksPanel extends React.PureComponent {
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

    return (
      <div className="Panel BookmarksPanel" style={{ display }} data-element="bookmarksPanel">
        <div onClick={() => {
          addBookmark({ pageIndex: core.getCurrentPage() - 1, text: 'asdf' });
        }}>
          ADD BOOKMARK
        </div>
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(BookmarksPanel));
