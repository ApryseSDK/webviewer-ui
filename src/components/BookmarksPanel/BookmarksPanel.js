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
    bookmarks: PropTypes.object,
    addBookmark: PropTypes.func.isRequired,
    display: PropTypes.string.isRequired,
    currentPage: PropTypes.number.isRequired,
    isDisabled: PropTypes.bool,
  }

  render() {
    const { isDisabled, display, bookmarks, addBookmark, currentPage, t } = this.props;

    if (isDisabled) {
      return null;
    }

    const pageIndexes = Object.keys(bookmarks).map(pageIndex => parseInt(pageIndex, 10));
    return (
      <div className="Panel BookmarksPanel" style={{ display }} data-element="bookmarksPanel">
        {
          this.state.isAdding ?
            <EditingBookmark
              label={`${t('component.bookmarkPage')} ${currentPage}: ${t('component.newBookmark')}`}
              bookmarkText={''}
              onSave={newText => {
                addBookmark(currentPage - 1, newText);
                this.setState({ isAdding: false });
              }}
              onCancel={() => {
                this.setState({ isAdding: false });
              }}
            /> :
            <div className="bookmarks-panel-header ">
              <div className="bookmarks-panel-container">
                <Icon
                  glyph="ic_bookmarks_black_24px"
                />
                <div className="label">{t('component.bookmarksPanel')}</div>
              </div>
              <div
                className="bookmarks-panel-button"
                onClick={() => {
                  this.setState({ isAdding: true });
                }}
              >
                {t('component.newBookmark')}
              </div>
            </div>
        }
        <div className="bookmarks-panel-row">
          {pageIndexes.map(pageIndex => (
            <React.Fragment>
              <div className="bookmarks-panel-label">{`${t('component.bookmarkPage')} ${pageIndex + 1}`}</div>
              <Bookmark text={bookmarks[pageIndex]} pageIndex={pageIndex} />
            </React.Fragment>
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
