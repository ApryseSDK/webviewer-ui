import React from 'react';
import classNames from 'classnames';
import './Divider.scss';

const Divider = ({ headerDirection }) => {
  const className = classNames('Divider', `${headerDirection || 'column'}`);

  return (
    <div className={className} />
  );
};

export default Divider;