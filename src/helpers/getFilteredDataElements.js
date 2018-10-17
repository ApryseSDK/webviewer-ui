import selectors from 'selectors';

export default (state, dataElements, priority) => {
  return dataElements.reduce((filteredDataElements, dataElement) => {
    const currentPriority = selectors.getDisabledElementPriority(state, dataElement);
    
    if (!currentPriority || priority >= currentPriority) {
      return [ ...filteredDataElements, dataElement]; 
    }

    return filteredDataElements;
  }, []);
};
