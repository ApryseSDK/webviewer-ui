import React, { useContext } from 'react';
import { useStore } from 'react-redux';

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

  return (
    <RedactionSearchOverlay
      setIsRedactionSearchActive={setIsRedactionSearchActive}
      executeRedactionSearch={(options = {}) => executeRedactionSearch(options, store)}
      {...props}
    />);
};

export default RedactionSearchOverlayContainer;