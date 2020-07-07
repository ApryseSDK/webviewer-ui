import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import EditingBookmark from 'components/Bookmark/EditingBookmark';
import Icon from 'components/Icon';
import Element from 'components/Element';

import actions from 'actions';

import core from 'core';

import './Bookmark.scss';

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
    text: PropTypes.string.isRequired,
    pageIndex: PropTypes.number.isRequired,
  }

  render() {
    const { text, editBookmark, removeBookmark, pageIndex } = this.props;

    if (this.state.isEditing) {
      return (
        <EditingBookmark
          className="editing"
          bookmarkText={text}
          onSave={newText => {
            editBookmark(pageIndex, newText);
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
        className="bookmark"
        onMouseEnter={() => this.setState({ isHovered: true })}
        onMouseMove={() => this.setState({ isHovered: true })}
        onMouseLeave={() => this.setState({ isHovered: false })}
      >
        <div
          onClick={() => core.setCurrentPage(pageIndex + 1)}
          className="bookmark-button"
        >
          {text}
        </div>
        {this.state.isHovered &&
          <Element dataElement="bookmarkControls" className="bookmark-controls bookmark-button">
            <div
              onClick={() => this.setState({ isEditing: true })}
            >
              <Icon
                glyph="edit-24px"
              />
            </div>
            <div
              onClick={() => removeBookmark(pageIndex)}
            >
              <Icon
                glyph="cancel-24px"
              />
            </div>
          </Element>
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
