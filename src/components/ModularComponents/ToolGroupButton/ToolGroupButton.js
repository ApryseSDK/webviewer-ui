import React from 'react';
import selectors from 'selectors';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'actions';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import defaultTool from 'constants/defaultTool';
import core from 'core';
import './ToolGroupButton.scss';

const ToolGroupButton = (props) => {
  const { dataElement, title, disabled, img, label, toolGroup, tools } = props;
  const [activeToolGroup, lastPickedToolForGroup] = useSelector((state) => [
    selectors.getActiveToolGroup(state),
    selectors.getLastPickedToolForGroup(state, toolGroup),
  ]);

  const dispatch = useDispatch();

  const isActive = activeToolGroup === toolGroup;

  const onClick = () => {
    if (isActive) {
      dispatch(actions.closeElement('toolStylePopup'));
      core.setToolMode(defaultTool);
      dispatch(actions.setActiveToolGroup(''));
    } else {
      dispatch(actions.closeElement('toolStylePopup'));
      if (toolGroup === 'signatureTools' || toolGroup === 'rubberStampTools') {
        core.setToolMode(defaultTool);
      } else {
        core.setToolMode(lastPickedToolForGroup || tools[0].toolName);
      }
      dispatch(actions.setActiveToolGroup(toolGroup));
      dispatch(actions.openElement('toolsOverlay'));
    }
  };

  return (
    <div className="ToolGroupButton">
      <Button
        isActive={isActive}
        dataElement={dataElement}
        img={img}
        label={label}
        title={title}
        onClick={onClick}
        disabled={disabled}
      >
      </Button>
    </div>
  );
};

ToolGroupButton.propTypes = {
  dataElement: PropTypes.string,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  img: PropTypes.string,
  label: PropTypes.string,
  getCurrentToolbarGroup: PropTypes.func,
  toolGroup: PropTypes.string,
};

export default ToolGroupButton;