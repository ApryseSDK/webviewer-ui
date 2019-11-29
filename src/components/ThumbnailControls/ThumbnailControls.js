import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { PageRotation } from 'constants/pageRotation';
import Button from 'components/Button';
import core from 'core';

import './ThumbnailControls.scss';

class ThumbnailControls extends React.PureComponent {
  static propTypes = {
    index: PropTypes.number.isRequired,
    handleDelete: PropTypes.func.isRequired,
  }

  rotateClockwise = () => {
    const { index } = this.props;
    core.rotatePages([index + 1], PageRotation.e_90);
  }

  rotateCounterClockwise = () => {
    const { index } = this.props;
    core.rotatePages([index + 1], PageRotation.e_270);
  }

  render() {
    return (
      <div className="thumbnailControls" data-element="thumbnailControls">
        <Button
          img="ic_rotate_left_black_24px"
          onClick={this.rotateCounterClockwise}
          title="option.thumbnailPanel.rotateCounterClockwise"
        />
        <Button
          img="ic_delete_black_24px"
          onClick={this.props.handleDelete}
          title="option.thumbnailPanel.delete"
        />
        <Button
          img="ic_rotate_right_black_24px"
          onClick={this.rotateClockwise}
          title="option.thumbnailPanel.rotateClockwise"
        />
      </div>
    );
  }
}

export default withTranslation()(ThumbnailControls);