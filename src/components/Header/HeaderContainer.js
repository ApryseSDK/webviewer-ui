import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import Header from './Header';
import ToolsHeader from './ToolsHeader';
import HeaderV2 from './HeaderV2/HeaderV2';


function HeaderContainer() {
  const featureFlags = useSelector((state) => selectors.getFeatureFlags(state));
  const { headerV2 } = featureFlags;

  if (headerV2) {
    return <HeaderV2 />;
  }
  return (
    <>
      <Header />
      <ToolsHeader />
    </>
  );
}

export default HeaderContainer;