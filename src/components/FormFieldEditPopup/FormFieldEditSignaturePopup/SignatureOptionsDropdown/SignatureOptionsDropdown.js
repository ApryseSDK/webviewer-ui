import React, { useState } from 'react';
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

const SignatureOptionsDropdown = (props) => {
  const { onChangeHandler, initialOption } = props;
  const { t } = useTranslation();
  const styles = getStyles();
  const signatureOptions = [
    { value: SignatureModes.FULL_SIGNATURE, label: t('formField.types.signature') },
    { value: SignatureModes.INITIALS, label: t('option.type.initials') },
  ];

  const init = signatureOptions.find((option) => option.value === initialOption);
  const [value, setValue] = useState(init);

  const onChange = (option) => {
    setValue(option);
    onChangeHandler(option);
  };

  return (
    <DataElementWrapper className="signature-options-container" dataElement="signatureOptionsDropdown">
      <label>{t('formField.type')}:</label>
      <ReactSelectWebComponentProvider>
        <Select
          value={value}
          onChange={onChange}
          styles={styles}
          options={signatureOptions}
          isSearchable={false}
          isClearable={false}
          components={{ IndicatorsContainer: ReactSelectCustomArrowIndicator }}
          aria-label={t('formField.type')}
        />
      </ReactSelectWebComponentProvider>
    </DataElementWrapper>
  );
};

export default SignatureOptionsDropdown;