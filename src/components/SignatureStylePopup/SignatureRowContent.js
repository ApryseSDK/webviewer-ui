import React from 'react';
import classNames from 'classnames';

import './SignatureRowContent.scss';

const SignatureRowContent = ({ onClick }) => {
  return (
    <div
      className={classNames({
        "signature-row-content": true,
        "interactable": onClick,
      })}
    >
      hello
    </div>
  );
};

export default SignatureRowContent;