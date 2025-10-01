import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';

import '../FilePickerHandler/FilePickerHandler.scss';

/**
 * @ignore
 * This component works as a pure intermediary for opening the file picker.
 * We expose only the click function to parent component by using `useImperativeHandle`.
 * The logic of processing the selected file is handled in the parent component.
 */
const ImageFilePickerHandler = forwardRef(({
  acceptedFormats,
  className = 'FilePickerHandler',
  onFileInputChange,
  filePickerId,
}, ref) => {
  const fileInputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    click: () => {
      fileInputRef.current?.click();
    }
  }), []);

  return (
    <div className={className}>
      <input
        id={filePickerId}
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats}
        onChange={onFileInputChange}
      />
    </div>
  );
});

ImageFilePickerHandler.displayName = 'ImageFilePickerHandler';

ImageFilePickerHandler.propTypes = {
  acceptedFormats: PropTypes.string,
  className: PropTypes.string,
  filePickerId: PropTypes.string,
  onFileInputChange: PropTypes.func,
};

export default ImageFilePickerHandler;
