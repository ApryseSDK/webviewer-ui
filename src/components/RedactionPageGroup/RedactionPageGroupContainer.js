import React, { useEffect, useState } from 'react';
import RedactionPageGroup from './RedactionPageGroup';
import { getSortStrategies } from 'constants/sortStrategies';

const RedactionPageGroupContainer = (props) => {
  // Putting this in the container in case we want to allow users to change sort strategies
  // which are stored in the application state
  const { redactionItems } = props;
  // Sorting strategies can be applied to any list of annotations
  const [sortedRedactionItems, setSortedRedactionItems] = useState([]);
  useEffect(() => {
    setSortedRedactionItems(getSortStrategies()['position'].getSortedNotes(redactionItems));
  }, [redactionItems]);
  return (
    <RedactionPageGroup
      redactionItems={sortedRedactionItems}
      {...props}
    />
  );
};

export default RedactionPageGroupContainer;