import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import OverlayTrigger from 'components/OverlayTrigger';
import ToolStylePopup from 'components/ToolStylePopup';
import Button from 'components/Button';

import core from 'core';
import toolStylesExist from 'helpers/toolStylesExist';
import getToolStyles from 'helpers/getToolStyles';
import { mapToolNameToKey } from 'constants/map';
import selectors from 'selectors';

import './ToolButton.scss';

const propTypes = {
  toolName: PropTypes.string.isRequired,
  group: PropTypes.string,
};

const ToolButton = ({ toolName, ...restProps }) => {
  const [
    isActive,
    // activeToolStyles,
    iconColor,
    { group, showColor, ...restObjectData },
  ] = useSelector(
    state => [
      selectors.getActiveToolName(state) === toolName,
      // selectors.getActiveToolStyles(state),
      selectors.getIconColor(state, mapToolNameToKey(toolName)),
      selectors.getToolButtonObject(state, toolName),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();

  // const handleMouseDown = () => {
  //   if (isActive) {
  //     if (toolStylesExist(toolName)) {
  //       dispatch(actions.toggleElement('toolStylePopup'));
  //     }
  //   } else {
  //     core.setToolMode(toolName);
  //     dispatch(actions.setActiveToolGroup(group));
  //     dispatch(actions.closeElement('toolStylePopup'));
  //   }
  // };

  const toolStyles = getToolStyles(toolName);
  let color = '';

  if (showColor === 'always' || (showColor === 'active' && isActive)) {
    color = toolStyles?.[iconColor]?.toHexString?.();
  }

  const children = (
    <Button
      className={classNames({
        ToolButton: true,
        hasStyles: toolStylesExist(toolName),
      })}
      disable={core.getTool(toolName)?.disabled}
      isActive={isActive}
      color={color}
      {...restProps}
      {...restObjectData}
    />
  );

  return toolStyles ? (
    <>
      <Overlay target={} show={show}>
        <ToolStylePopup />
      </Overlay>
      {children}
    </>
  ) : (
    children
  );
};

ToolButton.propTypes = propTypes;

export default ToolButton;
