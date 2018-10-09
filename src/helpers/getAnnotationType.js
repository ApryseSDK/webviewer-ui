export default annotation => {
  let type = annotation['_xsi:type'];

  if (type === 'Line' && annotation.getEndStyle() === 'OpenArrow') {
    type = 'Arrow';
  } else if (type === 'Polygon' && annotation.Style === 'cloudy') {
    type = 'Cloud';
  } else if (type === 'Free Hand' && annotation.Subject === 'Signature') {
    type = 'Signature';
  } else if (type === 'FreeText' && annotation.intent === 'FreeTextCallout') {
    type = 'Callout';
  }

  return type;
};