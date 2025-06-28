import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const VisuallyHiddenLabel = ({ id, label }) => {
  const [t] = useTranslation();

  return (
    <div
      id={id}
      className='visually-hidden'
    >
      {t(label)}
    </div>
  );
};

VisuallyHiddenLabel.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default VisuallyHiddenLabel;
