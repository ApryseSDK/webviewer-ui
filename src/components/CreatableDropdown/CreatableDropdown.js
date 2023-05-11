import React from 'react';
import { useTranslation } from 'react-i18next';
import CreatableSelect from 'react-select/creatable';

import './CreatableDropdown.scss';

const CreatableDropdown = ({
  onChange,
  onInputChange,
  options,
  onCreateOption,
  textPlaceholder,
  value,
  isClearable,
  isValid,
  messageText,
}) => {
  const { t } = useTranslation();

  const customStyles = {
    control: (provided, state) => {
      return {
        ...provided,
        backgroundColor: 'var(--component-background)',
        borderColor: state.selectProps.isValid ? 'hsl(0, 0%, 80%)' : 'hsl(28, 80%, 52%)',
        boxShadow: state.selectProps.isValid ? null : '0 0 0 2px rgba(230, 126, 34, 0.4)',
        '&:hover': {
          borderColor: state.selectProps.isValid ? 'hsl(0, 0%, 70%)' : 'hsl(28, 80%, 52%)',
        }
      };
    },
    singleValue: (provided) => ({
      ...provided,
      color: 'var(--text-color)',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'var(--component-background)',
      color: 'var(--text-color)',
    }),
    option: (provided) => ({
      ...provided,
      backgroundColor: 'var(--component-background)',
      color: 'var(--text-color)',
      '&:hover': {
        backgroundColor: 'var(--popup-button-hover)',
      }
    }),
    input: (provided) => ({
      ...provided,
      backgroundColor: 'var(--component-background)',
      color: 'var(--text-color)',
    }),
  };

  return (
    <div>
      <CreatableSelect
        isClearable={isClearable}
        onChange={onChange}
        onInputChange={onInputChange}
        options={options}
        onCreateOption={onCreateOption}
        placeholder={textPlaceholder}
        formatCreateLabel={(value) => `${t('action.create')} ${value}`}
        value={value}
        styles={customStyles}
        isValid={isValid}
      />
      {messageText ? <div className="messageText">{messageText}</div> : undefined}
    </div>
  );
};

export default CreatableDropdown;
