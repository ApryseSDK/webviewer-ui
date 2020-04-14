import React from 'react';
import classNames from 'classnames';

import './SignatureRowContent.scss';

const SignatureRowContent = ({ onClick, imgSrc, isActive }) => {
  return (
    <div
      className={classNames({
        "signature-row-content": true,
        "interactable": onClick,
        "active": isActive,
      })}
      onClick={onClick}
    >
      <img src={imgSrc} />
    </div>
  );
};

export default SignatureRowContent;