import React from 'react';
import FilterAnnotModal from './FilterAnnotModal';
import useCore from 'hooks/useCore';

function FilterAnnotModalContainer() {
  const { core } = useCore();
  const isInFormBuilderMode = core.getAnnotationManager().getFormFieldCreationManager().isInFormFieldCreationMode();
  return <FilterAnnotModal isInFormBuilderMode={isInFormBuilderMode}/>;
}

export default FilterAnnotModalContainer;