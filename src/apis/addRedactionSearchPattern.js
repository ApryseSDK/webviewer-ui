/**
 * Adds a new search pattern to the redaction search panel
 * @method UI.addRedactionSearchPattern
 * @param {UI.RedactionSearchPattern} searchPattern A search pattern to add to the redaction search panel
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.addRedactionSearchPattern(
      {
        label: 'Social Security Number',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 30 30"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
        type: 'socialSecurityNumber',
        regex: /\b\d{3}-?\d{2}-?\d{4}\b/,
      }
    );
  });

// Or to search kewyord(s):
WebViewer(...)
.then(function(instance) {
  instance.UI.addRedactionSearchPattern(
    {
      label: 'Confidential Information',
      type: 'confidentialInformation',
      regex: /confidential information/i, //Regex based search for text, case insensitive
    }
  );
});

 */

import actions from 'actions';

export default store => (redactionSearchPattern, regex) => {
  store.dispatch(actions.addRedactionSearchPattern(redactionSearchPattern, regex));
};


/**
* @typedef {Object} UI.RedactionSearchPattern
* @property {string} label The label to be used for the search pattern in the UI
* @property {string} type A string representing the type of item being searched for. For example, if searching for postal codes, this could be 'postalCode'. This is used
* to determine which icon will be used to render the result in the search panel.
* @property {string} [icon] The icon to be used for the search pattern in the search dropdown for the UI and the redaction panel for this type of search. Can be an inline SVG, or the name of an icon included in the WebViewer UI icon set.
* If no icon is passed, the default icon for text searches will be used.
* @property {RegExp} regex The regex to be used for the search pattern
*/
