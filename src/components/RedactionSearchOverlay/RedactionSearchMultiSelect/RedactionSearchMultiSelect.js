import React from 'react';
import { components } from 'react-select';
import Icon from 'components/Icon';
import CreatableMultiSelect from 'components/CreatableMultiSelect';
import { useTranslation } from 'react-i18next';
import { COMMON_COLORS } from 'constants/commonColors';

const getColorForMode = (isDarkMode, darkModeColor, lightModeColor, isFocused = true) => {
  if (isFocused) {
    return isDarkMode ? darkModeColor : lightModeColor;
  }
  return 'transparent';
};

const getStyles = (isDarkMode) => ({
  groupHeading: (base) => ({
    ...base,
    textTransform: 'none',
    fontSize: '10px',
    color: getColorForMode(isDarkMode, COMMON_COLORS['white'], COMMON_COLORS['gray8']),
    paddingBottom: '8px',
    paddingLeft: '8px',
    paddingTop: '10px',
  }),
  group: (base) => ({
    ...base,
    padding: '0px',
  }),
  menu: (base) => ({
    ...base,
    padding: '0px 0px 0px 0px',
  }),
  menuList: (base) => ({
    ...base,
    padding: '0px',
    backgroundColor: getColorForMode(isDarkMode, COMMON_COLORS['black'], COMMON_COLORS['white']),
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: getColorForMode(isDarkMode, COMMON_COLORS['blue1DarkMode'], COMMON_COLORS['blue1LightMode']),
    padding: '2px 8px',
    fontSize: '13px',
    borderRadius: '4px',
  }),
  option: (base, state) => ({
    ...base,
    height: '28px',
    display: 'flex',
    fontSize: '13px',
    padding: '6px 8px',
    '&:hover': {
      backgroundColor: getColorForMode(isDarkMode, COMMON_COLORS['blue1DarkMode'], COMMON_COLORS['blue1LightMode']),
    },
    backgroundColor: getColorForMode(isDarkMode, COMMON_COLORS['blue1DarkMode'], COMMON_COLORS['blue1LightMode'], state.isFocused),
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '1px',
    maxHeight: '70px',
    overflowY: 'scroll',
  }),
  control: (base) => ({
    ...base,
    backgroundColor: getColorForMode(isDarkMode, COMMON_COLORS['gray10'], COMMON_COLORS['white']),
    minHeight: '29px',
    borderColor: getColorForMode(isDarkMode, COMMON_COLORS['gray8'], COMMON_COLORS['gray4']),
    '&:hover': {
      borderColor: getColorForMode(isDarkMode, COMMON_COLORS['gray8'], COMMON_COLORS['gray4']),
    },
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: '13px',
    color: getColorForMode(isDarkMode, COMMON_COLORS['gray7'], COMMON_COLORS['gray5']),
    paddingLeft: '4px',
  }),
  input: (base) => ({
    ...base,
    fontSize: '13px',
    color: getColorForMode(isDarkMode, COMMON_COLORS['white'], COMMON_COLORS['gray8']),
    paddingLeft: '3px',
  }),
});

const RedactionOption = (props) => {
  const { data } = props;
  const { t } = useTranslation();
  return (
    <components.Option {...props}>
      {data.icon && <Icon glyph={data.icon} />}
      {t(data.label)}
    </components.Option>
  );
};

const MultiValueLabel = ({ data }) => {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', height: '18px' }}>
      {data.icon && <Icon glyph={data.icon} />}
      {t(data.label)}
    </div>
  );
};

const RedactionSearchMultiSelect = (props) => {
  const { t } = useTranslation();
  const { activeTheme, redactionSearchOptions } = props;

  const redactionGroup = [
    {
      label: t('redactionPanel.search.pattern'),
      options: redactionSearchOptions,
    },
  ];

  const isDarkMode = activeTheme === 'dark';
  const styles = getStyles(isDarkMode);

  return (
    <CreatableMultiSelect
      options={redactionGroup}
      styles={styles}
      components={{ Option: RedactionOption, MultiValueLabel, IndicatorsContainer: () => null }}
      placeholder={t('redactionPanel.redactionSearchPlaceholder')}
      formatCreateLabel={(value) => `${t('component.searchPanel')} ${value}`}
      {...props}
    />
  );
};

export default RedactionSearchMultiSelect;
