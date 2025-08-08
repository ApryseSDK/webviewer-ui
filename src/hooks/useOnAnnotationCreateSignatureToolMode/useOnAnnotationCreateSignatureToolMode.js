import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import defaultTool from 'constants/defaultTool';
import { ITEM_RENDER_PREFIXES } from 'src/constants/customizationVariables';

const ToolNames = window.Core.Tools.ToolNames;

export default function useOnAnnotationCreateSignatureToolMode() {
  const dispatch = useDispatch();
  const { customizableUI } = useSelector((state) => selectors.getFeatureFlags(state));
  const signatureListPanelInFlyout = useSelector((state) => selectors.getIsPanelInFlyout(state, ITEM_RENDER_PREFIXES.SIGNATURE_LIST_PANEL));

  React.useEffect(() => {
    if (customizableUI) {
      const handleToolModeUpdated = (newTool) => {
        if (newTool?.name === ToolNames.SIGNATURE) {
          if (signatureListPanelInFlyout) {
            dispatch(actions.openFlyout(signatureListPanelInFlyout.dataElement, newTool.dataElement));
            return;
          }
          dispatch(actions.openElement(DataElements.SIGNATURE_LIST_PANEL));
        } else if (newTool?.name !== defaultTool && newTool?.name !== ToolNames.TEXT_SELECT) {
          const componentToClose = signatureListPanelInFlyout ? signatureListPanelInFlyout.dataElement : DataElements.SIGNATURE_LIST_PANEL;
          dispatch(actions.closeElement(componentToClose));
        }
      };

      core.addEventListener('toolModeUpdated', handleToolModeUpdated);

      return () => {
        core.removeEventListener('toolModeUpdated', handleToolModeUpdated);
      };
    }
  }, [customizableUI, signatureListPanelInFlyout]);
}