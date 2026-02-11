import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'src/constants/dataElement';
import { ITEM_RENDER_PREFIXES } from 'src/constants/customizationVariables';

const StylePanelFlyout = () => {
  const dispatch = useDispatch();
  const currentFlyout = useSelector((state) => selectors.getFlyout(state, DataElements.MULTI_SELECT_STYLE_PANEL_FLYOUT));

  useEffect(() => {
    const StylePanelFlyout = {
      dataElement: DataElements.MULTI_SELECT_STYLE_PANEL_FLYOUT,
      className: 'MultiSelectStylePanelFlyout',
      items: [
        {
          'dataElement': 'stylePanelInFlyout',
          'render': ITEM_RENDER_PREFIXES.STYLE_PANEL
        },
      ]
    };

    if (!currentFlyout) {
      dispatch(actions.addFlyout(StylePanelFlyout));
    } else {
      dispatch(actions.updateFlyout(StylePanelFlyout.dataElement, StylePanelFlyout));
    }
  }, []);

  return null;
};

export default StylePanelFlyout;
