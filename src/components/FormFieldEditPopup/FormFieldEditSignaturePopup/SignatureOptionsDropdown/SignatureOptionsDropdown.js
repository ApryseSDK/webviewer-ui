import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import DataElementWrapper from 'components/DataElementWrapper';
import SignatureModes from 'constants/signatureModes';
import ReactSelectCustomArrowIndicator from 'components/ReactSelectCustomArrowIndicator';
import ReactSelectWebComponentProvider from 'src/components/ReactSelectWebComponentProvider';

import './SignatureOptionsDropdown.scss';

const getStyles = () => ({
  control: (provided, state) => ({
    ...provided,
    minHeight: '28px',
    backgroundColor: 'var(--component-background)',
    borderColor: state.isFocused ? 'var(--gray-10)' : 'hsl(0, 0%, 80%)',
    borderRadius: state.isFocused ? '4px' : provided.borderRadius,
    borderWidth: state.isFocused ? '2px' : provided.borderWidth,
    boxShadow: state.isFocused ? '0 0 0 1px var(--gray-10)' : null,
    '&:hover': {
      borderColor: state.isFocused ? 'var(--gray-10)' : 'hsl(0, 0%, 70%)',
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '2px',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'var(--text-color)',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'var(--component-background)',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'var(--blue-5)' : 'var(--component-background)',
    '&:hover': {
      backgroundColor: 'var(--blue-6)',
      color: 'var(--gray-0)',
    },
    '&:active': {
      backgroundColor: state.isSelected ? 'var(--blue-5)' : 'var(--blue-6)',
    },
    border: state.isFocused ? 'var(--focus-visible-outline) !important' : 'null',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    paddingRight: '6px',
    height: '26px',
  }),
});

const propTypes = {
  onChangeHandler: PropTypes.func.isRequired,
  initialOption: PropTypes.string,
};

const SignatureOptionsDropdown = ({ onChangeHandler, initialOption }) => {
  const { t } = useTranslation();
  const styles = getStyles();
  const signatureOptions = [
    { value: SignatureModes.FULL_SIGNATURE, label: t('formField.types.signature') },
    { value: SignatureModes.INITIALS, label: t('option.type.initials') },
  ];

  const init = signatureOptions.find((option) => option.value === initialOption);
  const [value, setValue] = useState(init);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const onChange = (option) => {
    setValue(option);
    onChangeHandler(option);
    setMenuIsOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setMenuIsOpen((prev) => !prev);
    }
  };

  const handleMenuOpen = () => {
    setMenuIsOpen(true);
  };

  const handleMenuClose = () => {
    setMenuIsOpen(false);
  };

  return (
    <DataElementWrapper className="signature-options-container" dataElement="signatureOptionsDropdown">
      <label id="form-field-type-label">{t('formField.type')}:</label>
      <ReactSelectWebComponentProvider>
        <Select
          value={value}
          onChange={onChange}
          styles={styles}
          options={signatureOptions}
          isSearchable={false}
          isClearable={false}
          components={{ IndicatorsContainer: ReactSelectCustomArrowIndicator }}
          aria-labelledby="form-field-type-label"
          onKeyDown={handleKeyDown}
          menuIsOpen={menuIsOpen}
          onMenuOpen={handleMenuOpen}
          onMenuClose={handleMenuClose}
        />
      </ReactSelectWebComponentProvider>
    </DataElementWrapper>
  );
};

SignatureOptionsDropdown.propTypes = propTypes;

export default SignatureOptionsDropdown;