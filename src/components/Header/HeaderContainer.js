import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import Header from './Header';
import ToolsHeader from './ToolsHeader';
import CustomHeader from './CustomHeader/CustomHeader';


function HeaderContainer() {
  const featureFlags = useSelector((state) => selectors.getFeatureFlags(state));
  const { modularHeader } = featureFlags;

  if (modularHeader) {
    return <CustomHeader />;
  }
  return (
    <>
      <Header />
      <ToolsHeader />
    </>
  );
}

export default HeaderContainer;