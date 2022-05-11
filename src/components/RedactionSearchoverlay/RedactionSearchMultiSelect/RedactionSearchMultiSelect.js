import React from 'react';
import { components } from 'react-select';
import Icon from 'components/Icon';
import CreatableMultiSelect from 'components/CreatableMultiSelect';
import { useTranslation } from 'react-i18next';

const getStyles = (isDarkMode) => ({
  groupHeading: (base) => ({
    ...base,
    textTransform: 'none',
    fontSize: '10px',
    color: isDarkMode ? '#FFFFFF' : '#485056',
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
    padding: '0px 0px 0px 0px'
  }),
  menuList: (base) => ({
    ...base,
    padding: '0px',
    backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: isDarkMode ? '#192530' : '#E7EDF3',

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
    "&:hover": {
      backgroundColor: isDarkMode ? '#192530' : '#E7EDF3',
    },
    backgroundColor: state.isFocused ? isDarkMode ? '#192530' : '#E7EDF3' : 'transparent',
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '1px',
    maxHeight: '70px',
    overflowY: 'scroll',
  }),
  control: (base) => ({
    ...base,
    backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
    minHeight: '29px',
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: '13px',
    color: '#ADB5BD',
  }),
  input: (base) => ({
    ...base,
    fontSize: '13px',
    color: isDarkMode ? '#FFFFFF' : '#485056',
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
    }
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