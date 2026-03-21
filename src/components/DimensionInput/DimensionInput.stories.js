import React from 'react';
import DimensionInput from './DimensionInput';
import { disableRtlModeParameters } from 'helpers/storybookParams';

export default {
  title: 'Components/DimensionInput',
  component: DimensionInput,
};

export function Basic() {
  const props = {
    label: 'label',
    initialValue: 3.22,
    onChange: () => { },
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

Basic.parameters = disableRtlModeParameters;
