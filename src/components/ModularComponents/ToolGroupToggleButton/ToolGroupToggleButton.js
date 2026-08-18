import React, { useEffect, forwardRef } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import actions from 'actions';
import selectors from 'selectors';
import defaultTool from 'constants/defaultTool';
import useCore from 'src/hooks/useCore';
import Button from 'src/components/Button';
import { mapToolNameToKey } from 'src/constants/map';
import getToolButtonColors from 'src/helpers/getToolButtonColors';
import FlyoutItemContainer from '../FlyoutItemContainer';
import { getIconDOMElement } from 'src/helpers/itemToFlyoutHelper';

const ToolGroupToggleButton = forwardRef((props, ref) => {
  const {
    isFlyoutItem,
    dataElement,
    className,
    img,
    title,
    label,
    disabled,
    groupedItems,
    shouldToggleVisibility = true,
  } = props;

  const { core } = useCore();
  const dispatch = useDispatch();

  const activeToolName = useSelector(selectors.getActiveToolName);
  const toolNamesInGroup = useSelector((state) => selectors.getAllToolNamesForGroupedItems(state, groupedItems), shallowEqual);
  const firstToolNameInGroup = toolNamesInGroup?.[0];
  const lastPickedToolForGroup = useSelector((state) => selectors.getLastPickedToolForGroup(state, groupedItems));
  const lastPickedToolButton = useSelector((state) => selectors.getToolButtonObject(state, lastPickedToolForGroup), shallowEqual);
  // Subscribe so colors re-render when the displayed tool's styles change.
  const activeToolStyles = useSelector(selectors.getActiveToolStyles); // eslint-disable-line no-unused-vars
  const iconColorKey = useSelector((state) => selectors.getIconColor(state, mapToolNameToKey(lastPickedToolForGroup)));
  const customOverrides = useSelector((state) => selectors.getCustomElementOverrides(state, lastPickedToolButton?.dataElement), shallowEqual);
  const isToggleActive = toolNamesInGroup.includes(activeToolName);

  useEffect(() => {
    // On first load, set the last picked tool to the first tool in the group
    if (!lastPickedToolForGroup && firstToolNameInGroup) {
      dispatch(actions.setLastPickedToolForGroup(groupedItems, firstToolNameInGroup));
    }
  }, []);

  useEffect(() => {
    // Show/hide the tool group depending on whether the toggle is active
    if (shouldToggleVisibility && groupedItems) {
      if (isToggleActive) {
        dispatch(actions.enableElements([groupedItems]));
      } else {
        dispatch(actions.disableElements([groupedItems]));
      }
    }
  }, [isToggleActive, shouldToggleVisibility, groupedItems]);

  useEffect(() => {
    if (isToggleActive && activeToolName !== lastPickedToolForGroup) {
      dispatch(actions.setLastPickedToolForGroup(groupedItems, activeToolName));
    }
  }, [isToggleActive, activeToolName, lastPickedToolForGroup, groupedItems]);

  if (!groupedItems) {
    return null;
  }

  const handleClick = () => {
    if (isToggleActive) {
      core.setToolMode(defaultTool);
    } else if (lastPickedToolForGroup) {
      core.setToolMode(lastPickedToolForGroup);
    }
  };

  // Use the same icon and styling as the last picked tool in the group
  const { color, fillColor, strokeColor } = getToolButtonColors({
    toolName: lastPickedToolForGroup,
    showColor: customOverrides?.showColor || lastPickedToolButton?.showColor,
    isActive: isToggleActive,
    iconColorKey,
  });

  if (isFlyoutItem) {
    const icon = getIconDOMElement({
      icon: img || lastPickedToolButton?.img,
      color,
      fillColor,
      strokeColor,
    }, props.allFlyoutItems || []);
    return (
      <FlyoutItemContainer {...props}
        ref={ref}
        onClick={handleClick}
        title={title}
        label={label}
        icon={icon}
        additionalClass={isToggleActive ? 'active' : ''}
      />
    );
  }

  return (
    <div className={classNames('ToolGroupToggleButton')}>
      <Button
        toolName={lastPickedToolForGroup}
        dataElement={dataElement || lastPickedToolButton?.dataElement}
        img={img || lastPickedToolButton?.img}
        title={title}
        label={label}
        disabled={disabled}
        className={className}
        groupedItem={groupedItems}
        isActive={isToggleActive}
        ariaCurrent={isToggleActive}
        ariaPressed={isToggleActive}
        onClick={handleClick}
        color={color}
        fillColor={fillColor}
        strokeColor={strokeColor}
      />
    </div>
  );
});

ToolGroupToggleButton.propTypes = {
  dataElement: PropTypes.string,
  className: PropTypes.string,
  img: PropTypes.string,
  title: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  groupedItems: PropTypes.string.isRequired,
  shouldToggleVisibility: PropTypes.bool,
  isFlyoutItem: PropTypes.bool,
  allFlyoutItems: PropTypes.array,
};

ToolGroupToggleButton.displayName = 'ToolGroupToggleButton';

export default ToolGroupToggleButton;