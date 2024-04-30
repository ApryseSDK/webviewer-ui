export default (linkAnnotation) => {
  if (!linkAnnotation) {
    return;
  }
  if (linkAnnotation.actions.U?.[0] instanceof window.Core.Actions.URI) {
    return linkAnnotation.actions.U?.[0]?.uri;
  }
  if (linkAnnotation.actions.U?.[0] instanceof window.Core.Actions.GoTo) {
    // TODO Need translation for this in the actual component that uses this helper
    return `Page ${linkAnnotation.actions.U?.[0]?.dest.page}`;
  }
};