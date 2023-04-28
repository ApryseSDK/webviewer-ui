import React, { useState } from 'react';
import Select, { components } from 'react-select';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import DataElementWrapper from 'components/DataElementWrapper';
import SignatureModes from 'constants/signatureModes';

import './SignatureOptionsDropdown.scss';

const getStyles = (isDarkMode) => ({
  valueContainer: (base) => ({
    ...base,
    padding: '2px',
  }),
  control: (base) => ({
    ...base,
    backgroundColor: isDarkMode ? '#21242A' : '#FFFFFF',
    minHeight: '28px',
    borderColor: isDarkMode ? '#485056' : '#CFD4DA',
    '&:hover': {
      borderColor: isDarkMode ? '#485056' : '#CFD4DA',
    },
  }),
  container: (base) => ({
    ...base,
    backgroundColor: isDarkMode ? '#21242A' : '#FFFFFF',
    height: '29px',
    borderColor: isDarkMode ? '#485056' : 'red',
    '&:hover': {
      borderColor: isDarkMode ? '#485056' : '#CFD4DA',
    },
  }),
  indicatorsContainer: (base) => {
    return {
      ...base,
      paddingRight: '6px',
      height: '26px',
    };
  },
});

const CustomArrowIndicator = (props) => {
  const { selectProps } = props;
  const { menuIsOpen } = selectProps;
  return (
    <components.IndicatorsContainer {...props}>
      <Icon className="arrow" glyph={`icon-chevron-${menuIsOpen ? 'up' : 'down'}`} />
    </components.IndicatorsContainer>
  );
};

const SignatureOptionsDropdown = (props) => {
  const { onChangeHandler, initialOption } = props;
  const { t } = useTranslation();
  const styles = getStyles(false);
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
    <DataElementWrapper
      className='signature-options-container'
      dataElement='signatureOptionsDropdown'
    >
      <label>
        {t('formField.type')}:
      </label>
      <Select
        value={value}
        onChange={onChange}
        styles={styles}
        options={signatureOptions}
        isSearchable={false}
        isClearable={false}
        components={{ IndicatorsContainer: CustomArrowIndicator }} />
    </DataElementWrapper>
  );
};

export default SignatureOptionsDropdown;