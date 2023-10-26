import React from 'react';
import CreatableSelect from 'react-select/creatable';
import ReactSelectWebComponentProvider from '../ReactSelectWebComponentProvider';

const CreatableMultiSelect = (props) => {
  return (
    <ReactSelectWebComponentProvider>
      <CreatableSelect isMulti {...props} />
    </ReactSelectWebComponentProvider>
  );
};

export default CreatableMultiSelect;