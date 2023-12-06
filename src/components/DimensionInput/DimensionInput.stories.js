import React from 'react';
import DimensionInput from './DimensionInput';

export default {
  title: 'Components/DimensionInput',
  component: DimensionInput,
};

export function Basic() {
  const props = {
    label: 'label',
    initialValue: 3.22,
    onChange: () => {},
    unit: 'cm',
    maxLength: 5,
    disabled: false
  };

  return (
    <div>
      <DimensionInput
        {...props}
      />
    </div>
  );
}