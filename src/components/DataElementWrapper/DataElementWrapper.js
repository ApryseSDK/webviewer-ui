import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';

const propTypes = {
  children: PropTypes.node,
  dataElement: PropTypes.string,
};

const DataElementWrapper = ({ children, dataElement, ...props }) => {
  const isDisabled = useSelector(state => selectors.isElementDisabled(state, dataElement));

  return isDisabled ? null : (
    <div data-element={dataElement} {...props}>
      {children}
    </div>
  );
};

DataElementWrapper.propTypes = propTypes;
export default DataElementWrapper;
