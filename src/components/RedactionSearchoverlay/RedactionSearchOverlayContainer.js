import React, { useContext } from 'react';
import { useStore, useSelector } from 'react-redux';
import selectors from 'selectors';

import RedactionSearchOverlay from './RedactionSearchOverlay';
import { RedactionPanelContext } from '../RedactionPanel/RedactionPanelContext';
import multiSearchFactory from '../../helpers/multiSearch';


function executeRedactionSearch(options, store) {
  const multiSearch = multiSearchFactory(store);
  multiSearch(options);
}

const RedactionSearchOverlayContainer = (props) => {

  const { setIsRedactionSearchActive } = useContext(RedactionPanelContext);
  const store = useStore();
  const activeTheme = useSelector(state => selectors.getActiveTheme(state));

  return (
    <RedactionSearchOverlay
      setIsRedactionSearchActive={setIsRedactionSearchActive}
      executeRedactionSearch={(options = {}) => executeRedactionSearch(options, store)}
      activeTheme={activeTheme}
      {...props}
    />);
};

export default RedactionSearchOverlayContainer;