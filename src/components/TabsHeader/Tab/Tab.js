import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Tab.scss';
import Button from 'components/Button';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { removeFileNameExtension } from 'helpers/TabManager';

const propTypes = {
  tab: PropTypes.any.isRequired,
  isActive: PropTypes.bool,
  isToLeftOfActive: PropTypes.bool,
  closeTab: PropTypes.func,
  setActive: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragLeave: PropTypes.func,
  id: PropTypes.string,
  tabNameHandler: PropTypes.func,
};

const Tab = ({ tab, setActive, onDragLeave, onDragStart, onDragOver, isActive, closeTab, id, isToLeftOfActive, tabNameHandler }) => {
  const [disabled, setDisabled] = useState(tab?.disabled);
  const fileName = tabNameHandler ? tabNameHandler(tab.options.filename) : tab.options.filename;
  const removeExtension = true;
  const labelName = removeExtension ? removeFileNameExtension(fileName, false) : fileName;
  const nameForId = labelName?.replace(/\s+/g, '').toLowerCase();
  const { t } = useTranslation();
  const untitledLabelName = labelName?.includes('untitled') ? t('message.untitled') + labelName.replace('untitled', '') : undefined;

  useEffect(() => {
    if (tab && tab.disabled !== disabled) {
      setDisabled(tab.disabled);
    }
  }, [tab]);

  const tabLabel = (
    <div className={classNames({ 'file-text': true, disabled })} >
      <p>{untitledLabelName || labelName}</p>
    </div>
  );

  return (
    <div className={classNames({ 'draggable-tab': true, active: isActive })}
      onDragOver={onDragOver} onDragStart={onDragStart} onDragLeave={onDragLeave} draggable id={id}
    >
      <Button
        role="tab"
        ariaControls={`document-container-${nameForId}`}
        ariaSelected={isActive}
        ariaLabel={labelName}
        tabIndex={isActive ? 0 : -1}
        className={classNames({ Tab: true })}
        onClick={setActive}
        title={untitledLabelName || labelName}
        label={tabLabel}
        useI18String={false}
      />
      <div className={'close-button-wrapper'}>
        <Button
          img="icon-close"
          title="action.close"
          onClick={closeTab}
          ariaLabel={`${t('action.close')} ${labelName}`}
          tabIndex={-1}
        />
        {!isActive && !isToLeftOfActive && <div className="divider" />}
      </div>
    </div>
  );
};

Tab.propTypes = propTypes;

export default Tab;