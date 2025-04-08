import React from 'react';
import FilterAnnotModal from './FilterAnnotModal';
import core from 'core';

function FilterAnnotModalContainer() {
  const isInFormBuilderMode = core.getAnnotationManager().getFormFieldCreationManager().isInFormFieldCreationMode();
  return <FilterAnnotModal isInFormBuilderMode={isInFormBuilderMode}/>;
}

export default FilterAnnotModalContainer;