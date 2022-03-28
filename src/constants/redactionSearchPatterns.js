/**
* Available search patterns that can be passed to {@link UI.replaceRedactionSearchPattern UI.replaceRedactionSearchPattern}. <br/><br/>
* @name UI.RedactionSearchPatterns
* @enum {string}
* @property {string} EMAILS Search pattern for emails
* @property {string} CREDIT_CARDS Search pattern for credit card numbers
* @property {string} PHONE_NUMBERS Search pattern for phone numbers
*/
export default {
  EMAILS: 'emails',
  CREDIT_CARDS: 'creditCards',
  PHONE_NUMBERS: 'phoneNumbers',
};