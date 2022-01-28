import actions from 'actions';

/**
 * @callback SignatureFilterFunction
 * @memberof UI
 * @param {Core.Annotations.Annotation} annotation  A signature annotation found in the SignatureCreateTool saved signatures list
 * @param {number} index An optional parameter for the index of the annotaiton parameter within the SignatureCreateTool saved signatures list
 * @returns {boolean} Whether or not a signature annotation should be included in the annotation preset
 */

/**
 * Accepts a function that filters what saved signatures will be displayed in the signature annotation preset. Changing this function will instantly changes signatures displayed in the preset.
 *
 * @method UI.setDisplayedSignaturesFilter
 * @param {UI.SignatureFilterFunction} filterFunction The function that will be used to filter signatrues displayed in the preset
 * @example
Webviewer(...)
  .then(instance => {
    // Only signatures that have a value set for the 'isInitial' custom data property will display in the preset
    instance.UI.setDisplayedSignaturesFilter((a) => a.getCustomData('isInitial'));
  });
 */
export default store => filterFunction => {
  store.dispatch(actions.setDisplayedSignaturesFilterFunction(filterFunction));
};
