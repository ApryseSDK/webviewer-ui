import React from 'react';
import classNames from 'classnames';

import './SignatureRowContent.scss';

const SignatureRowContent = ({ onClick, imgSrc, isActive, altText }) => {
  return (
    <button
      className={classNames({
        "signature-row-content": true,
        "interactable": onClick,
        "active": isActive,
      })}
      onClick={onClick}
    >
      <img alt={altText} src={imgSrc} />
    </button>
  );
};

export default SignatureRowContent;