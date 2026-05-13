import React, { forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import ActionButton from 'components/ActionButton';
import FlyoutItemContainer from '../ModularComponents/FlyoutItemContainer';
import ImageFilePickerHandler from 'components/ImageFilePickerHandler';
import classNames from 'classnames';
const propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  buttonStyle: PropTypes.object,
  /** @deprecated Use buttonStyle instead. */
  style: PropTypes.object,
  className: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
  label: PropTypes.string,
  acceptedFormats: PropTypes.string,
  onFileInputChange: PropTypes.func,
  filePickerId: PropTypes.string,
};

const InsertImageButton = forwardRef((props, ref) => {
  const {
    isFlyoutItem,
    buttonStyle,
    className = '',
    dataElement,
    icon,
    title,
    label,
    acceptedFormats,
    onFileInputChange,
    filePickerId,
  } = props;
  const resolvedButtonStyle = buttonStyle ?? props.style;
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {isFlyoutItem ? (
        <FlyoutItemContainer
          {...props}
          ref={ref}
          onClickHandler={() => handleClick}
        />
      ) : (
        <ActionButton
          onClick={handleClick}
          dataElement={dataElement}
          title={title}
          img={icon}
          label={label}
          buttonStyle={resolvedButtonStyle}
          className={
            classNames({
              [className]: true,
            })
          }
        />
      )}
      <ImageFilePickerHandler
        acceptedFormats={acceptedFormats}
        ref={fileInputRef}
        onFileInputChange={onFileInputChange}
        filePickerId={filePickerId}
      />
    </>
  );
});

InsertImageButton.propTypes = propTypes;
InsertImageButton.displayName = 'InsertImageButton';

export default InsertImageButton;
