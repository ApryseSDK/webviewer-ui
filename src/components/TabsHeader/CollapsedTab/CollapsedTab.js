import React, { useEffect, useState } from 'react';
import './CollapsedTab.scss';
import Button from "components/Button";
import PropTypes from "prop-types";
import classNames from "classnames";

const propTypes = {
  tab: PropTypes.any.isRequired,
  isActive: PropTypes.bool,
  closeTab: PropTypes.func,
  setActive: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragLeave: PropTypes.func,
  id: PropTypes.string,
};

const Tab = ({ tab, setActive, onDragStart, closeTab, id }) => {
  const [disabled, setDisabled] = useState(tab?.disabled);
  const removeExtension = true;
  const name = removeExtension ? tab.options.filename.split(".")[0] : tab.options.filename;

  useEffect(() => {
    setDisabled(tab?.disabled);
  }, [tab]);

  return (
    <div className={"draggable-collapsed-tab"} onDragStart={onDragStart} draggable id={id}>
      <div className={'CollapsedTab'}>
        <div className={classNames({ "file-text": true, disabled })} onClick={setActive}>
          <p>{name}</p>
        </div>
        <Button
          img="icon-close"
          title="action.close"
          onClick={closeTab}
        />
      </div>
    </div>
  );
};

Tab.propTypes = propTypes;

export default Tab;