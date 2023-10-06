import React from 'react';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'actions';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import defaultTool from 'constants/defaultTool';
import core from 'core';
import { shortcutAria } from 'helpers/hotkeysManager';
import './ToolGroupButton.scss';

const ToolGroupButton = (props) => {
  const {
    dataElement,
    title,
    disabled,
    img,
    label,
    toolGroup,
    tools,
    isFlyoutItem,
    callHandleClick,
    iconDOMElement,
    subMenuDOMElement,
  } = props;
  const [activeToolGroup, lastPickedToolForGroup] = useSelector((state) => [
    selectors.getActiveToolGroup(state),
    selectors.getLastPickedToolForGroup(state, toolGroup),
  ]);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isActive = activeToolGroup === toolGroup;

  const shortcutKey = title ? title.slice(title.indexOf('.') + 1) : undefined;
  const ariaKeyshortcuts = shortcutKey ? shortcutAria(shortcutKey) : undefined;

  const onClick = () => {
    dispatch(actions.closeElement('toolStylePopup'));
    if (isActive) {
      core.setToolMode(defaultTool);
      dispatch(actions.setActiveToolGroup(''));
    } else {
      if (toolGroup === 'signatureTools' || toolGroup === 'rubberStampTools') {
        core.setToolMode(defaultTool);
      } else {
        core.setToolMode(lastPickedToolForGroup || tools[0].toolName);
      }
      dispatch(actions.setActiveToolGroup(toolGroup));
      dispatch(actions.openElement('toolsOverlay'));
    }
    callHandleClick?.(props);
  };

  return (
    isFlyoutItem ?
      (
        <>
          <div className="menu-container" onClick={onClick}>
            <div className="icon-label-wrapper">
              {iconDOMElement}
              {label && <div className="flyout-item-label">{t(label)}</div>}
            </div>
            {ariaKeyshortcuts && <span className="hotkey-wrapper">{`(${ariaKeyshortcuts})`}</span>}
          </div>
          {subMenuDOMElement}
        </>
      ) :
      (
        <div className={classNames({
          'ToolGroupButton': true,
        })}>
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
      ));
};

ToolGroupButton.propTypes = {
  dataElement: PropTypes.string,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  img: PropTypes.string,
  label: PropTypes.string,
  getCurrentToolbarGroup: PropTypes.func,
  toolGroup: PropTypes.string,
  customClass: PropTypes.string,
  tools: PropTypes.array,
  isFlyoutItem: PropTypes.bool,
  callHandleClick: PropTypes.func,
  iconDOMElement: PropTypes.any,
  subMenuDOMElement: PropTypes.any,
};

export default ToolGroupButton;