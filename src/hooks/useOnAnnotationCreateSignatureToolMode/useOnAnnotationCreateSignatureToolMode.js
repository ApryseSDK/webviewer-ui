import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import defaultTool from 'constants/defaultTool';

const ToolNames = window.Core.Tools.ToolNames;

export default function useOnAnnotationCreateSignatureToolMode() {
  const dispatch = useDispatch();
  const { customizableUI } = useSelector((state) => selectors.getFeatureFlags(state));

  React.useEffect(() => {
    if (customizableUI) {
      const handleToolModeUpdated = (newTool) => {
        if (newTool?.name === ToolNames.SIGNATURE) {
          dispatch(actions.openElement(DataElements.SIGNATURE_LIST_PANEL));
        } else if (newTool?.name !== defaultTool && newTool?.name !== ToolNames.TEXT_SELECT) {
          dispatch(actions.closeElement(DataElements.SIGNATURE_LIST_PANEL));
        }
      };

      core.addEventListener('toolModeUpdated', handleToolModeUpdated);

      return () => {
        core.removeEventListener('toolModeUpdated', handleToolModeUpdated);
      };
    }
  }, [customizableUI]);
}