import React, { useContext } from 'react';
import { useStore, useSelector, shallowEqual } from 'react-redux';
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
  const redactionSearchPatterns = useSelector(state => selectors.getRedactionSearchPatterns(state), shallowEqual);
  const redactionSearchOptions = Object.values(redactionSearchPatterns).map(pattern => ({
    ...pattern,
    value: pattern.type,
  }));

  return (
    <RedactionSearchOverlay
      setIsRedactionSearchActive={setIsRedactionSearchActive}
      executeRedactionSearch={(options = {}) => executeRedactionSearch(options, store)}
      activeTheme={activeTheme}
      redactionSearchOptions={redactionSearchOptions}
      {...props}
    />);
};

export default RedactionSearchOverlayContainer;