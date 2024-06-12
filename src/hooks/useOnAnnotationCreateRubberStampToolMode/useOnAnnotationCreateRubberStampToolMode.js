import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import defaultTool from 'constants/defaultTool';

export default function useOnAnnotationCreateRubberStampToolMode() {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const { customizableUI } = useSelector((state) => selectors.getFeatureFlags(state));
  const { ToolNames } = window.Core.Tools;

  // Load all the stamps into redux store when the app mounts
  React.useEffect(() => {
    if (customizableUI) {
      dispatch(actions.setStandardStamps(t));
      dispatch(actions.setCustomStamps(t));
    }
  }, [t, customizableUI]);

  React.useEffect(() => {
    if (customizableUI) {
      const handleToolModeUpdated = (newTool) => {
        if (newTool?.name === ToolNames.RUBBER_STAMP) {
          dispatch(actions.openElement(DataElements.RUBBER_STAMP_PANEL));
        } else if (newTool?.name !== ToolNames.EDIT && newTool?.name !== ToolNames.TEXT_SELECT && newTool?.name !== defaultTool) {
          dispatch(actions.closeElement(DataElements.RUBBER_STAMP_PANEL));
        }
      };

      core.addEventListener('toolModeUpdated', handleToolModeUpdated);

      return () => {
        core.removeEventListener('toolModeUpdated', handleToolModeUpdated);
      };
    }
  }, [customizableUI]);
}