import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';
import { HiveAPI } from '../../helpers/hiveApi';

import './AttachedFile.scss';

const AttachedFile = ({ file }) => (
  <div key={file._id} className="hv-attached-file" onMouseDown={event => {
    event.stopPropagation();
    HiveAPI.onDownloadFile(file._id);
  }}>
    <Icon glyph="hive-paperclip" />
    <div className="hv-attached-file-url">{file.name}</div>
  </div>
);

AttachedFile.propTypes = {
  file: PropTypes.object.isRequired,
};

export default AttachedFile;
