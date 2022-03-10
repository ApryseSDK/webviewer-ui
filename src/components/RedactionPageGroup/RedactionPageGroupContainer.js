import React from 'react';
import RedactionPageGroup from './RedactionPageGroup';
import { getSortStrategies } from 'constants/sortStrategies';

const RedactionPageGroupContainer = (props) => {

  // Putting this in the container in case we want to allow users to change sort strategies
  // which are stored in the application state
  const { redactionItems } = props;
  // Sorting strategies can be applied to any list of annotations
  const sortedRedactionItems = getSortStrategies()['position'].getSortedNotes(redactionItems);
  return (
    <RedactionPageGroup
      redactionItems={sortedRedactionItems}
      {...props} />
  )
};

export default RedactionPageGroupContainer;