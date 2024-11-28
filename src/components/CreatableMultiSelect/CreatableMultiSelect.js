import React from 'react';
import CreatableSelect from 'react-select/creatable';
import ReactSelectWebComponentProvider from '../ReactSelectWebComponentProvider';
import './CreatableMultiSelect.scss';
import PropTypes from 'prop-types';

const CreatableMultiSelect = ({ id, label, ...rest }) => {
  return (
    <ReactSelectWebComponentProvider>
      <label htmlFor={id} className="creatable-multi-select-label">{label}</label>
      <div onTouchEndCapture={(e) => e.stopPropagation()}>
        <CreatableSelect
          isMulti
          {...rest}
          inputId={id}
        />
      </div>
    </ReactSelectWebComponentProvider>
  );
};

CreatableMultiSelect.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
};

CreatableMultiSelect.defaultProps = {
  id: '',
  label: '',
};

export default CreatableMultiSelect;