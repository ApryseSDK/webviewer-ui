import actions from 'actions';

/**
 * NOTE: Digital Signature Verification requires the WebViewer Full API
 * @namespace UI.VerificationOptions
 */

/**
 * Loads the Public Key Certificates to be used for Digital Signature
 * Verification.
 *
 * The contents of the X.509 Public Key Certificate need to encoded in a binary
 * Distinguished Encoding Rules (DER) format, or in the plaintext
 * Privacy-Enhanced Mail (PEM) format, which includes an appropriate header,
 * Base64 encoded DER representing the public key certificate, and appropriate
 * footer.
 * @method UI.VerificationOptions.addTrustedCertificates
 *
 * @param {
 *  Array<
 *    string | File | ArrayBuffer | Int8Array | Uint8Array | Uint8ClampedArray
 *  >
 * } certificates An array of URLs, and/or instance of the File type, and/or
 * a Binary Array datatype that contain the X.509 Public Key Certificates to be
 * used for validating Digital Signatures on a document.
 *
 * @example
 * WebViewer(...).then(async function(instance) {
 *   const response = await fetch(
 *     'https://mydomain.com/api/returns/certificate/as/arraybuffer'
 *   );
 *   const certificateAsArrayBuffer = await response.arrayBuffer();
 *   instance.UI.VerificationOptions.addTrustedCertificates([
 *      certificateAsArrayBuffer,
 *     'https://mydomain.com/path/to/certificate1.cer',
 *     'https://mydomain.com/path/to/certificate2.crt',
 *   ])
 * });
 */
const addTrustedCertificates = (store) => (certificates) => {
  store.dispatch(actions.addTrustedCertificates(certificates));
};

/**
 * Loads a Trust List to be used for Digital Signature Verification.
 *
 * The Trust List is structured in Acrobat's FDF Data/Cert Exchange format into
 * the VerificationOptions certificate store.
 *
 * Certificates inside the FDF trust list that cannot be decoded and loaded,
 * will be skipped.
 * @method UI.VerificationOptions.loadTrustList
 *
 * @param {Blob | ArrayBuffer | Int8Array | Uint8Array | Uint8ClampedArray} TrustList
 * A buffer representation of FDF Certificate Exchange Data
 *
 * @example
 * WebViewer(...).then(async function(instance) {
 *   const response = await fetch(
 *     'https://mydomain.com/api/returns/trustList/'
 *   );
 *   const trustListAsArrayBuffer = await response.arrayBuffer();
 *   instance.UI.VerificationOptions.loadTrustList(trustListAsArrayBuffer);
 * });
 */
const loadTrustList = (store) => (trustList) => {
  store.dispatch(actions.addTrustList(trustList));
};

/**
 * Enables online CRL revocation checking for verifying certificates.
 * @method UI.VerificationOptions.enableOnlineCRLRevocationChecking
 */
const enableOnlineCRLRevocationChecking = (store) => () => {
  store.dispatch(actions.setIsRevocationCheckingEnabled(true));
};

/**
 * Sets the proxy URL server used for online revocation requests during
 * Digital Signature Verification. Used to avoid CORS-related errors.
 * The default value is https://proxy.pdftron.com.
 * @method UI.VerificationOptions.setRevocationProxyPrefix
 *
 * @param {string} proxy_server_url
 * The URL (including the protocol such as 'https://') to use as a prefix for
 * making online revocation requests through a proxy server to avoid CORS
 * related issues. This can be suppressed by passing an empty string.
 * If null is provided, or if this API is not called, the default value
 * (https://proxy.pdftron.com) is used.
 *
 * @example
 * WebViewer(...).then(async function(instance) {
 *   instance.UI.VerificationOptions.setRevocationProxyPrefix('https://proxy.mydomain.com');
 * });
 */
const setRevocationProxyPrefix = (store) => (revocationProxyPrefix) => {
  store.dispatch(actions.setRevocationProxyPrefix(revocationProxyPrefix));
};

export {
  addTrustedCertificates,
  loadTrustList,
  enableOnlineCRLRevocationChecking,
  setRevocationProxyPrefix,
};
