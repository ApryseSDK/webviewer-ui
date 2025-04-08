import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import ActionButton from 'components/ActionButton';
import { menuItems } from '../../Helpers/menuItems';
import core from 'core';
import FlyoutItemContainer from '../../FlyoutItemContainer';
import classNames from 'classnames';

/**
 * A button that performs the redo action.
 * @name redoButton
 * @memberof UI.Components.PresetButton
 */
const RedoButton = forwardRef((props, ref) => {
  const { isFlyoutItem, dataElement, style, className } = props;
  const { icon, title } = menuItems.redoButton;
  const activeDocumentViewerKey = useSelector((state) => selectors.getActiveDocumentViewerKey(state));
  const canRedo = useSelector((state) => selectors.canRedo(state, activeDocumentViewerKey));
  const isOfficeEditorMode = useSelector((state) => selectors.getIsOfficeEditorMode(state));
  const isOfficeEditorRedoEnabled = useSelector((state) => selectors.isOfficeEditorRedoEnabled(state));
  const disabled = (!isOfficeEditorMode && !canRedo) || (isOfficeEditorMode && !isOfficeEditorRedoEnabled);

  const handleClick = () => {
    if (isOfficeEditorMode) {
      return core.getOfficeEditor().redo();
    }
    core.redo(activeDocumentViewerKey);
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={handleClick} disabled={disabled} />
      : (
        <ActionButton
          className={classNames({
            PresetButton: true,
            'redo-button': true,
            [className]: true,
          })}
          dataElement={dataElement}
          title={title}
          img={icon}
          onClick={handleClick}
          shouldPassActiveDocumentViewerKeyToOnClickHandler={true}
          disabled={disabled}
          style={style}
        />
      )
  );
});

RedoButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
};
RedoButton.displayName = 'RedoButton';

export default RedoButton;