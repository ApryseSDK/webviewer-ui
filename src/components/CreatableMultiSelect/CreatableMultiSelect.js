import React from 'react';
import CreatableSelect from 'react-select/creatable';

const CreatableMultiSelect = (props) => {
  return (
    <CreatableSelect
      isMulti
      {...props}
    />
  );
};

export default CreatableMultiSelect;