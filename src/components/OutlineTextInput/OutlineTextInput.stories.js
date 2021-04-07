import React from 'react';
import OutlineTextInput from './OutlineTextInput';

export default {
  title: 'Components/OutlineTextInput',
  component: OutlineTextInput,
};

export function Basic(props) {
  return (
    <div style={{ width: 300 }}>
      <OutlineTextInput {...props} />
    </div>
  );
}

export function DefaultValue() {
  return (
    <div style={{ width: 300 }}>
      <OutlineTextInput defaultValue="Untitled" />
    </div>
  );
}