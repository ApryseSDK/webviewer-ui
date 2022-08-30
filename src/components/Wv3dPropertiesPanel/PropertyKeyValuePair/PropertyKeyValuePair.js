import React from 'react';
import './PropertyKeyValuePair.scss';

const PropertyKeyValuePair = (props) => {
  const { name, value } = props;

  return (
    <div data-element="propertyKeyValuePair" className="property-pair" key={name}>
      <span className="property-key">{name}</span>
      <span className="property-value">{value}</span>
    </div>
  );
};

export default PropertyKeyValuePair;
