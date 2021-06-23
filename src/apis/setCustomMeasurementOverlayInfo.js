import action from 'actions';

/**
 * Adds a custom overlay to annotations if that annotation currently support it. Currently only the Ellipsis annotation supports it.
 * @method UI.setCustomMeasurementOverlay
 * @param {array} customOverlayInfo an array of customOverlay configurations. The configuration object has five properties: title, label, validate, value, and onChange
 * @example
WebViewer(...)
  .then(function(instance) {
      instance.UI.setCustomMeasurementOverlayInfo([
      {
        title: "Radius Measurement", //Title for overlay
        label: "Radius", // Label to be shown for the value
        // Validate is a function to validate the annotation is valid for the current custom overlay
        validate: annotation => annotation instanceof instance.Annotations.EllipseAnnotation,
        // The value to be shown in the custom overlay
        value: annotation => annotation.Width / 2,
        // onChange will be called whenever the value in the overlay changes from user input
        onChange: (e, annotation) => {
          // Do something with the annot like resize/redraw
          instance.Core.annotationManager.redrawAnnotation(annotation);
        }
      }
    ])
  });
 */

export default store => customOverlayInfo => {
  store.dispatch(action.setCustomMeasurementOverlay(customOverlayInfo));
};
