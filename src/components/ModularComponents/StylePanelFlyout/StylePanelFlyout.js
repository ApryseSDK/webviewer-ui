import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';
import DataElements from 'src/constants/dataElement';
import { ITEM_RENDER_PREFIXES } from 'src/constants/customizationVariables';

const StylePanelFlyout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const StylePanelFlyout = {
      dataElement: DataElements.MULTI_SELECT_STYLE_PANEL_FLYOUT,
      className: 'StylePanelFlyout',
      items: [
        {
          'dataElement': 'stylePanelInFlyout',
          'render': ITEM_RENDER_PREFIXES.STYLE_PANEL
        },
      ]
    };
    dispatch(actions.addFlyout(StylePanelFlyout));
  }, []);

  return null;
};

export default StylePanelFlyout;
