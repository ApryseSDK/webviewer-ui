import ActionButton from 'components/ActionButton';
import classNames from 'classnames';
import DataElements from 'constants/dataElement';
import PropTypes from 'prop-types';
import React from 'react';

import './LinkAnnotationPopup.scss';

const propTypes = {
  handleUnLink: PropTypes.func,
  isAnnotation: PropTypes.bool,
  isMobileDevice: PropTypes.bool,
  linkText: PropTypes.string,
  handleOnMouseEnter: PropTypes.func,
  handleOnMouseLeave: PropTypes.func,
  handleMouseMove: PropTypes.func,
};

const LinkAnnotationPopup = ({
  handleUnLink,
  isAnnotation,
  isMobileDevice,
  linkText,
  handleOnMouseEnter,
  handleOnMouseLeave,
  handleMouseMove
}) => {
  const renderContents = () => (
    <div className="contents" data-element={DataElements.LINK_URI}>
      {linkText && (
        <>
          <div className="link-annot-input">
            {linkText}
          </div>
          <div className="divider" />
        </>
      )}
      <ActionButton
        className="main-menu-button"
        dataElement={DataElements.LINK_ANNOTATION_UNLINK_BUTTON}
        title='action.unlink'
        img='icon-tool-unlink'
        onClick={handleUnLink}
      />
    </div>
  );

  if (isMobileDevice || !isAnnotation) {
    return null;
  }

  return (
    <div
      data-testid="link-annotation-element"
      className={classNames({
        Popup: true,
        LinkAnnotationPopup: true,
        'is-horizontal': true
      })}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {renderContents()}
    </div>
  );
};

LinkAnnotationPopup.propTypes = propTypes;

export default LinkAnnotationPopup;
