import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';
import { HiveAPI } from '../../helpers/hiveApi';

import './AttachedFile.scss';

const AttachedFile = React.memo(({ _id, name }) => (
  <div className="hv-attached-file" onMouseDown={event => {
    event.stopPropagation();
    HiveAPI.onDownloadFile(_id);
  }}>
    <Icon glyph="hive-paperclip" />
    <div className="hv-attached-file-url">{name}</div>
  </div>
));

AttachedFile.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string,
};

export default AttachedFile;
