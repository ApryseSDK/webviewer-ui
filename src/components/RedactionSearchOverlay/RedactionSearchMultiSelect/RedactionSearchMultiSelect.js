import React from 'react';
import { components } from 'react-select';
import Icon from 'components/Icon';
import CreatableMultiSelect from 'components/CreatableMultiSelect';
import { useTranslation } from 'react-i18next';
import { COMMON_COLORS, CUSTOM_UI_VARS } from 'constants/commonColors';
import PropTypes from 'prop-types';
import './RedactionSearchMultiSelect.scss';

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
    fontSize: '13px',
    fontWeight: 'bold',
    color: getColorForMode(isDarkMode, COMMON_COLORS['white'], CUSTOM_UI_VARS['text-color']),
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
    borderRadius: '4px',
    overflowY: 'visible',
    margin: '0'
  }),
  menuList: (base) => ({
    ...base,
    padding: '0px',
    backgroundColor: getColorForMode(isDarkMode, COMMON_COLORS['black'], COMMON_COLORS['gray0']),
    overflowY: 'visible',
    borderRadius: '4px',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: getColorForMode(isDarkMode, COMMON_COLORS['blue1DarkMode'], COMMON_COLORS['gray2']),
    padding: '2px 8px',
    fontSize: '13px',
    borderRadius: '4px',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
    color: getColorForMode(isDarkMode, COMMON_COLORS['white'], CUSTOM_UI_VARS['text-color'])
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: COMMON_COLORS['gray6'],
    borderRadius: '4px',
    marginLeft: '4px',
    padding: '0px',
    '&:hover': {
      backgroundColor: COMMON_COLORS['gray2'],
      boxShadow: `inset 0 0 0 1px ${COMMON_COLORS['blue6']}`,
      color: COMMON_COLORS['gray6'],
    },
    'svg': {
      height: '16px',
      width: '16px',
    },
  }),
  option: (base) => ({
    ...base,
    display: 'flex',
    fontSize: '13px',
    padding: '6px 8px 0',
    '&:hover': {
      backgroundColor: getColorForMode(isDarkMode, COMMON_COLORS['blue1DarkMode'], CUSTOM_UI_VARS['primary-button-hover']),
      color: COMMON_COLORS['gray0'],
    },
    backgroundColor: getColorForMode(isDarkMode, COMMON_COLORS['blue1DarkMode'], COMMON_COLORS['gray0']),
    overflowY: 'visible',
    whiteSpace: 'normal',
    '&:last-child': {
      borderRadius: '0 0 4px 4px',
      paddingBottom: '6px',
    },
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: CUSTOM_UI_VARS['text-color'],
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
    minHeight: '28px',
    borderColor: getColorForMode(isDarkMode, COMMON_COLORS['gray8'], COMMON_COLORS['gray6']),
    '&:focus-within': {
      borderColor: getColorForMode(isDarkMode, COMMON_COLORS['gray8'], COMMON_COLORS['blue5']),
    },
    // override the default border color on focus
    '&:hover': {
      borderColor: getColorForMode(isDarkMode, COMMON_COLORS['gray8'], COMMON_COLORS['gray6']),
    },
    boxShadow: 'none !important',
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
    color: getColorForMode(isDarkMode, COMMON_COLORS['white'], CUSTOM_UI_VARS['text-color']),
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

RedactionOption.propTypes = {
  data: PropTypes.object.isRequired,
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

MultiValueLabel.propTypes = {
  data: PropTypes.object.isRequired,
};

const CustomControl = ({ children, ...props }) => (
  <components.Control {...props}>
    <div className="redaction-search-multi-select-search-icon-container">
      <Icon className="redaction-search-multi-select-search-icon" glyph="icon-header-search" />
    </div>
    {children}
  </components.Control>
);

CustomControl.propTypes = {
  children: PropTypes.node,
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
      components={{ Option: RedactionOption, MultiValueLabel, IndicatorsContainer: () => null, Control: CustomControl }}
      placeholder={''}
      formatCreateLabel={(value) => `${t('component.searchPanel')} ${value}`}
      id="redaction-search-multi-select"
      label={t('redactionPanel.redactionSearchPlaceholder')}
      {...props}
    />
  );
};

RedactionSearchMultiSelect.propTypes = {
  activeTheme: PropTypes.string.isRequired,
  redactionSearchOptions: PropTypes.array.isRequired,
};

export default RedactionSearchMultiSelect;
