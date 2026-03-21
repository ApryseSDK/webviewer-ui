import React from 'react';
import Flyout from 'components/ModularComponents/Flyout/Flyout';

export const ConditionalFlyout = ({ store }) => {
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    const updateRenderState = () => {
      const state = store.getState();
      const activeFlyout = state.viewer.activeFlyout;
      const flyoutExists = activeFlyout && state.viewer.flyoutMap[activeFlyout];
      const isElementOpen = activeFlyout && state.viewer.openElements[activeFlyout];
      const hasValidItems = flyoutExists && Array.isArray(flyoutExists.items);

      setShouldRender(!!(flyoutExists && isElementOpen && hasValidItems));
    };

    const unsubscribe = store.subscribe(updateRenderState);
    updateRenderState();
    return unsubscribe;
  }, [store]);

  return shouldRender ? <Flyout /> : null;
};