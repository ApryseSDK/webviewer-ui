import { Choice as ChoiceComponent } from '@pdftron/webviewer-react-toolkit';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';

import './Choice.scss';

const propTypes = {
  dataElement: PropTypes.string,
};

const Choice = React.forwardRef(({ dataElement, ...props }, ref) => {
  const isDisabled = useSelector((state) => (dataElement ? selectors.isElementDisabled(state, dataElement) : false));

  return isDisabled ? null : <ChoiceComponent {...props} ref={ref} center />;
});

Choice.displayName = 'Choice';
Choice.propTypes = propTypes;

export default Choice;
