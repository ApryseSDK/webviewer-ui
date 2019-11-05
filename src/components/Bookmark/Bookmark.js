import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import EditingBookmark from 'components/Bookmark/EditingBookmark';
import Icon from 'components/Icon';

import actions from 'actions';

import core from 'core';

import './bookmark.scss';

class Bookmark extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      isHovered: false,
    };
  }


  static propTypes = {
    editBookmark: PropTypes.func.isRequired,
    removeBookmark: PropTypes.func.isRequired,
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
            this.setState({ isEditing: false, isHovered: false });
          }}
          onCancel={() => {
            this.setState({ isEditing: false, isHovered: false });
          }}
        />
      );
    }

    return (
      <div
        className="Bookmark"
        onMouseEnter={() => this.setState({ isHovered: true })}
        onMouseMove={() => this.setState({ isHovered: true })}
        onMouseLeave={() => this.setState({ isHovered: false })}
      >
        <div onClick={() => core.setCurrentPage(bookmark.pageIndex + 1)}>{bookmark.text}</div>
        {this.state.isHovered &&
          <div className="Controls-2">
            <div
              onClick={() => this.setState({ isEditing: true })}
            >
              <Icon
                className="icon"
                glyph="edit-24px"
              />
            </div>
            <div
              onClick={() => removeBookmark(index)}
            >
              <Icon
                className="icon"
                glyph="cancel-24px"
              />
            </div>
          </div>
        }
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
