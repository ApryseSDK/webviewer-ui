import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Tab.scss';
import Button from 'components/Button';
import classNames from 'classnames';

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
};

const Tab = ({ tab, setActive, onDragLeave, onDragStart, onDragOver, isActive, closeTab, id, isToLeftOfActive }) => {
  const [disabled, setDisabled] = useState(tab?.disabled);
  const removeExtension = true;
  const name = removeExtension ? tab.options.filename.split('.')[0] : tab.options.filename;

  useEffect(() => {
    if (tab && tab.disabled !== disabled) {
      setDisabled(tab.disabled);
    }
  }, [tab]);

  return (
    <div className={'draggable-tab'}
      onDragOver={onDragOver} onDragStart={onDragStart} onDragLeave={onDragLeave} draggable id={id}
    >
      <div className={classNames({ Tab: true, active: isActive })}>
        <div className={classNames({ 'file-text': true, disabled })} onClick={setActive}>
          <p>{name}</p>
        </div>
        <Button
          img="icon-close"
          title="action.close"
          onClick={closeTab}
        />
        {!isActive && !isToLeftOfActive && <div className="divider"/>}
      </div>
    </div>
  );
};

Tab.propTypes = propTypes;

export default Tab;