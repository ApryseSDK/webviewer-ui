import React from 'react';
import PropTypes from 'prop-types';
import 'src/components/ModularComponents/ModularHeader/ModularHeader.scss';
import classNames from 'classnames';

const ModularHeader = (props) => {
  const { dataElement, placement } = props;


  const className = classNames('ModularHeader', `${placement}`);

  return (
    <div className={className}
      data-element={dataElement}
      key={dataElement}
      placement={placement}>
    </div>
  );
};

ModularHeader.propTypes = {
  dataElement: PropTypes.string.isRequired,
  placement: PropTypes.string.isRequired,
  position: PropTypes.string,
};

export default ModularHeader;
