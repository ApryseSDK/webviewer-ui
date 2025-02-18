import React from 'react';
import PropTypes from 'prop-types';
import ToggleElementButton from 'components/ModularComponents/ToggleElementButton';
import { useTranslation } from 'react-i18next';
import SheetOptionsFlyout from './TabOptionsFlyout';
import DataElements from 'src/constants/dataElement';


const TabOptions = (props) => {
  const {
    handleClick = () => { },
    id,
    onToggle,
    label,
    disabled,
    tabs,
  } = props;

  const [t] = useTranslation();
  const icon = 'icon-tools-more-vertical';

  return (
    <>
      <ToggleElementButton
        dataElement={`options-${id}`}
        title={t('option.searchPanel.moreOptions')}
        img={icon}
        onToggle={(isActive) => {
          if (isActive) {
            onToggle(label);
          }
        }}
        disabled={disabled}
        toggleElement={`${DataElements.SHEET_TAB_OPTIONS_FLYOUT}-${id}`}
      />
      <SheetOptionsFlyout
        sheetId={id}
        tabs={tabs}
        handleClick={(option) => handleClick(id, label, option)}
      />
    </>
  );
};

TabOptions.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  onToggle: PropTypes.func,
  handleClick: PropTypes.func,
  disabled: PropTypes.bool,
  tabs: PropTypes.array,
};

export default TabOptions;
