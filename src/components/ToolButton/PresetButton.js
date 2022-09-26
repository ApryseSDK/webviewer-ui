import React from 'react';
import Icon from 'components/Icon';
import ToolButton from 'components/ToolButton';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import actions from 'actions';
import selectors from 'selectors';

import './ToolButton.scss';

const PresetButton = ({
  toolName,
  isToolStyleOpen,
}) => {
  const [
    isActive,
  ] = useSelector(
    (state) => [
      selectors.getActiveToolName(state) === toolName,
    ],
  );

  const dispatch = useDispatch();
  const getStylingDropdownButton = () => {
    return (
      <div
        className="tool-button-arrow-container"
      >
        {isActive &&
          <div
            className="tool-button-arrow-inner-container"
            onClick={() => dispatch(actions.toggleElement('toolStylePopup'))}
          >
            {(isToolStyleOpen ?
              <Icon className="tool-button-arrow-up" glyph="icon-chevron-up" /> :
              <Icon className="tool-button-arrow-down" glyph="icon-chevron-down" />)}
          </div>}
      </div>
    );
  };

  return (
    <div
      className={classNames({
        'tool-button-container': true,
      })}
    >
      <ToolButton
        toolName={toolName}
      />
      {getStylingDropdownButton()}
    </div>
  );
};

export default PresetButton;
