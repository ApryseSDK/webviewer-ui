import React from 'react';
import { components } from 'react-select';
import Icon from 'components/Icon';
import CreatableMultiSelect from 'components/CreatableMultiSelect';
import { useTranslation } from 'react-i18next';

const redactionOptions = [
  { value: 'phoneNumbers', label: 'redactionPanel.search.phoneNumbers', icon: 'redact-icons-phone-number', type: 'phone' },
  { value: 'emails', label: 'redactionPanel.search.emails', icon: 'redact-icons-email', type: 'email' },
  { value: 'creditCardNumbers', label: 'redactionPanel.search.creditCards', icon: 'redact-icons-credit-card', type: 'creditCard' },
  // { value: 'images', label: 'redactionPanel.search.images', icon: 'redact-icons-image', type: 'image' }, Not to be part of first release
];

const styles = {
  groupHeading: (base) => ({
    ...base,
    textTransform: 'none',
    fontSize: '10px',
    color: '#485056',
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
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#E7EDF3',
    padding: '2px 8px',
    fontSize: '13px',
    borderRadius: '4px',
  }),
  option: (base) => ({
    ...base,
    height: '28px',
    display: 'flex',
    fontSize: '13px',
    padding: '6px 8px'
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '1px',
    maxHeight: '70px',
    overflowY: 'scroll',
  }),
  control: (base) => ({
    ...base,
    minHeight: '29px',
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: '13px',
    color: '#ADB5BD',
  })
};

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

  const redactionGroup = [
    {
      label: t('redactionPanel.search.pattern'),
      options: redactionOptions,
    }
  ];

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