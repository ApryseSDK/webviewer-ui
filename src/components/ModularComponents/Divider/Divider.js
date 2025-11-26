import React from 'react';
import classNames from 'classnames';
import './Divider.scss';
import PropTypes from 'prop-types';
import DataElementWrapper from 'src/components/DataElementWrapper';

const Divider = ({ headerDirection, style, className, dataElement }) => {
  const dividerClasses = classNames({
    'Divider': true,
    [`${headerDirection || 'column'}`]: true,
    [className]: true,
  });

  return (
    <DataElementWrapper
      dataElement={dataElement}
      className={dividerClasses}
      style={style}
    />
  );
};

Divider.propTypes = {
  headerDirection: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  dataElement: PropTypes.string,
};

export default Divider;