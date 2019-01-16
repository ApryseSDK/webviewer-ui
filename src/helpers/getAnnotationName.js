import i18next from 'i18next';

export default annotation => {
  let name = annotation.elementName;

  if (name === 'line' && annotation.getEndStyle() === 'OpenArrow') {
    name = 'arrow';
  } else if (name === 'polygon' && annotation.Style === 'cloudy') {
    name = 'cloud';
  } else if (name === 'ink' && annotation.Subject === i18next.t('annotation.signature')) {
    name = 'signature';
  } else if (name === 'freetext' && annotation.intent === 'FreeTextCallout') {
    name = 'callout';
  }

  return name;
};