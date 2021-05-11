import React from 'react';
import { useTranslation } from 'react-i18next';
import CreatableSelect from 'react-select/creatable';


const CreatableDropdown = ({
  onChange,
  onInputChange,
  options,
  onCreateOption,
  textPlaceholder,
  value,
  isClearable
}) => {
  const { t } = useTranslation();

  return (
    <CreatableSelect
      isClearable={isClearable}
      onChange={onChange}
      onInputChange={onInputChange}
      options={options}
      onCreateOption={onCreateOption}
      placeholder={textPlaceholder}
      formatCreateLabel={(value) => `${t('action.create')} ${value}`}
      value={value}
    />
  );
}

export default CreatableDropdown