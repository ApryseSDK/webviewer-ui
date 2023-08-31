import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import selectors from 'selectors';
import Header from './Header';
import ToolsHeader from './ToolsHeader';

function HeaderContainer() {
  const [
    featureFlags,
  ] = useSelector(
    (state) => [
      selectors.getFeatureFlags(state),
    ], shallowEqual);
  const { customizableUI } = featureFlags;

  if (!customizableUI) {
    return (
      <>
        <Header />
        <ToolsHeader />
      </>
    );
  }

  return null;
}

export default HeaderContainer;