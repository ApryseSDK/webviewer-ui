import actions from 'actions';


/**
 * @namespace VerificationOptions
 * @type {WebViewerInstance.VerificationOptions}
 * NOTE: Digital Signature Verification requires the WebViewer Full API
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
 * @method VerificationOptions#addTrustedCertificates
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
 *   instance.verificationOptions.addTrustedCertificates([
 *      certificateAsArrayBuffer,
 *     'https://mydomain.com/path/to/certificate1.cer',
 *     'https://mydomain.com/path/to/certificate2.crt',
 *   ])
 * });
 */
const addTrustedCertificates = store => certificates => {
  store.dispatch(actions.addTrustedCertificates(certificates));
};

export {
  addTrustedCertificates,
};
