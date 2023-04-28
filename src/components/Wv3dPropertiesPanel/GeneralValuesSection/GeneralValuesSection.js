import React from 'react';
import PropertyKeyValuePair from '../PropertyKeyValuePair/PropertyKeyValuePair';

const GeneralValuesSection = (props) => {
  const { entities } = props;

  const elements = [];

  for (const entity in entities) {
    elements.push(<PropertyKeyValuePair key={entity} name={entity} value={entities[entity]} />);
  }

  return <div data-element="generalValues">{elements}</div>;
};

export default GeneralValuesSection;
