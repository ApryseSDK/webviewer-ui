import selectors from 'selectors';

const getLinkDestination = (linkAnnotation, store) => {
  if (!linkAnnotation) {
    return '';
  }
  if (linkAnnotation.actions?.U?.[0] instanceof window.Core.Actions.URI) {
    return linkAnnotation.actions.U?.[0]?.uri;
  }
  if (linkAnnotation.actions?.U?.[0] instanceof window.Core.Actions.GoTo) {
    const state = store?.getState();
    const pageLabels = selectors.getPageLabels(state);
    const isCustomPageLabelsEnabled = selectors.isCustomPageLabelsEnabled(state);
    const destPageIndex = linkAnnotation.actions.U?.[0]?.dest.page;
    const pageLabel = isCustomPageLabelsEnabled ? pageLabels[destPageIndex - 1] : destPageIndex;
    // TODO Need translation for this in the actual component that uses this helper
    return `Page ${pageLabel}`;
  }

  return '';
};

export default getLinkDestination;