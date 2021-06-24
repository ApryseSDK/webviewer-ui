import core from 'core';
import actions from 'actions';

/**
 * Side-effect function that sets the verification status of the document.
 * One of three possible results can happen:
 *
 * 1. Valid: All signatures have been successfully verified
 * 2. Unknown: One or more signatures has issues, but the verification API
 * cannot definitively state the signatures are valid or invalid (i.e. a
 * required Public Key Certificate is missing)
 * 3. Invalid: The document has been digitally signed, but has one or more
 * invalid signatures (i.e. because the document was modified after it was
 * signed, and one or more signature field did not allow for this to occur)
 *
 * The above results are dictated by the return values of:
 *
 * PDFNet.VerificationResult.getDocumentStatus:
 * https://www.pdftron.com/api/web/PDFNet.VerificationResult.html#getDocumentStatus__anchor
 *
 * PDFNet.VerificationResult.getTrustStatus:
 * https://www.pdftron.com/api/web/PDFNet.VerificationResult.html#getTrustStatus__anchor
 *
 * PDFNet.VerificationResult.getDigestStatus:
 * https://www.pdftron.com/api/web/PDFNet.VerificationResult.html#getDigestStatus__anchor
 *
 * PDFNet.VerificationResult.getPermissionsStatus:
 * https://www.pdftron.com/api/web/PDFNet.VerificationResult.html#getPermissionsStatus__anchor
 *
 * Valid:
 * DocumentStatus.e_no_error && TrustStatus.e_trust_verified
 *
 * Unknown:
 * DocumentStatus.e_no_error
 * && (
 *  DigestStatus.e_digest_verified
 *  || DigestStatus.e_digest_verification_disabled
 * ) && trustStatus !== TrustStatus.e_no_trust_status
 * && (
 *   ModificationPermissionsStatus.e_unmodified
 *   || ModificationPermissionsStatus.e_has_allowed_changes
 *   || ModificationPermissionsStatus.e_permissions_verification_disabled
 * )
 *
 * Any other combinations will cause the signature field to be considered
 * Invalid.
 * @ignore
 */
export default async(certificates, sigWidgets, dispatch) => {
  const doc = core.getDocument();
  if (doc) {
    const verificationResult = await getVerificationResult(doc, sigWidgets, certificates);
    dispatch(actions.setVerificationResult(verificationResult));
  } else {
    window.documentViewer.addEventListener('documentLoaded', async() => {
      const verificationResult = await getVerificationResult(
        core.getDocument(),
        sigWidgets,
        certificates
      );
      dispatch(actions.setVerificationResult(verificationResult));
    }, { 'once': true });
  }
};

/**
 * Iterates through each signature widget in the document, retrieves and returns
 * all pertinent information pertaining to Digital Signature Verification
 *
 * @param {Core.Document} doc The document with signatures to verify
 * with the given certificate
 * @param {Array<Annotations.SignatureWidgetAnnotation>} sigWidgets An array of
 * signature widgets to verify with the given certificate
 * @param {Array<File | string>} certificates The certificate files to be used
 * for verification. Can be passed as a File object, or a URL in the form
 * of a string, in which a GET call will be made to retrieve the certificate
 *
 * @returns {object} An object mapping the field name of each signature widget
 * to their verification results
 * @ignore
 */
const getVerificationResult = async(doc, sigWidgets, certificates) => {
  const { PDFNet } = window;
  const { VerificationResult } = PDFNet;
  const {
    TrustStatus,
    DigestStatus,
    ModificationPermissionsStatus,
    DocumentStatus,
  } = VerificationResult;
  const verificationResults = {};

  await PDFNet.runWithCleanup(async() => {
    /**
     * @todo Remove re-assignment of argument from original code?
     */
    doc = await doc.getPDFDoc();
    const opts = await PDFNet.VerificationOptions.create(
      PDFNet.VerificationOptions.SecurityLevel.e_compatibility_and_archiving
    );

    for (const certificate of certificates) {
      if (typeof certificate === 'string') {
        await opts.addTrustedCertificateFromURL(certificate);
      } else if (
        certificate instanceof File ||
        Object.prototype.toString.call(certificate) === '[object File]'
      ) {
        const fileReader = new FileReader();
        const arrayBufferPromise = new Promise((resolve, reject) => {
          fileReader.addEventListener('load', async e => {
            resolve(new Uint8Array(e.target.result));
          });
          fileReader.addEventListener('error', () => {
            reject('Error reading the local certificate');
          });

          fileReader.readAsArrayBuffer(certificate);
        });

        await opts.addTrustedCertificate(await arrayBufferPromise);
      } else if (
        certificate instanceof ArrayBuffer
        || certificate instanceof Int8Array
        || certificate instanceof Uint8Array
        || certificate instanceof Uint8ClampedArray
      ) {
        await opts.addTrustedCertificate(await certificate);
      }
    }

    for (const widget of sigWidgets) {
      try {
        const fieldName = widget.getField().name;
        const digitalSigField = await doc.getDigitalSignatureField(fieldName);
        const result = await digitalSigField.verify(opts);
        const id = await (await digitalSigField.getSDFObj()).getObjNum();

        const signed = await digitalSigField.hasCryptographicSignature();
        let signer;
        let signTime;
        let documentPermission;
        let isCertification;
        let contactInfo;
        let location;
        let reason;
        let validAtTimeOfSigning;
        let signerName;
        const issuerField = {};
        const subjectField = {};

        if (signed) {
          signer =
            (await digitalSigField.getSignatureName()) || (await digitalSigField.getContactInfo());
          signTime = await digitalSigField.getSigningTime();

          if (await signTime.isValid()) {
            signTime = formatPDFNetDate(signTime);
          } else {
            signTime = null;
          }

          contactInfo = await digitalSigField.getContactInfo();
          location = await digitalSigField.getLocation();
          reason = await digitalSigField.getReason();

          documentPermission = await digitalSigField.getDocumentPermissions();
          isCertification = await digitalSigField.isCertification();
        }

        const verificationStatus = await result.getVerificationStatus();
        const documentStatus = await result.getDocumentStatus();
        const digestStatus = await result.getDigestStatus();
        const trustStatus = await result.getTrustStatus();
        const permissionStatus = await result.getPermissionsStatus();
        const digestAlgorithm = await result.getDigestAlgorithm();
        const disallowedChanges = await Promise.all(
          (await result.getDisallowedChanges()).map(async change => ({
            objnum: await change.getObjNum(),
            type: await change.getTypeAsString(),
          }))
        );
        const validSignerIdentity = trustStatus === TrustStatus.e_trust_verified;

        let trustVerificationResultString;
        let timeOfTrustVerificationEnum;
        let trustVerificationTime;
        const hasTrustVerificationResult = await result.hasTrustVerificationResult();
        if (hasTrustVerificationResult) {
          const trustVerificationResult = await result.getTrustVerificationResult();

          trustVerificationResultString = await trustVerificationResult.getResultString();
          timeOfTrustVerificationEnum = await trustVerificationResult.getTimeOfTrustVerificationEnum();

          const epochTrustVerificationTime = await trustVerificationResult.getTimeOfTrustVerification();
          if (epochTrustVerificationTime) {
            trustVerificationTime = formatDate(epochTrustVerificationTime);
          }
          const certPath = await trustVerificationResult.getCertPath();
          if (certPath.length) {
            const firstX509Cert = certPath[0];
            const retrievedIssuerField = await firstX509Cert.getIssuerField();
            const processedIssuerField = await processX501DistinguishedName(retrievedIssuerField);
            Object.assign(issuerField, processedIssuerField);
            const retrievedSubjectField = await firstX509Cert.getSubjectField();
            const processedSubjectField = await processX501DistinguishedName(retrievedSubjectField);
            Object.assign(subjectField, processedSubjectField);
            const lastX509Cert = certPath[certPath.length - 1];
            const notBeforeEpochTime = await lastX509Cert.getNotBeforeEpochTime();
            const notAfterEpochTime = await lastX509Cert.getNotAfterEpochTime();
            validAtTimeOfSigning = (
              notAfterEpochTime >= epochTrustVerificationTime
              && epochTrustVerificationTime >= notBeforeEpochTime
            );
          }
        }

        let badgeIcon;
        if (verificationStatus) {
          badgeIcon = 'digital_signature_valid';
        } else if (
          documentStatus === DocumentStatus.e_no_error &&
          (digestStatus === DigestStatus.e_digest_verified ||
            digestStatus === DigestStatus.e_digest_verification_disabled) &&
          trustStatus !== TrustStatus.e_no_trust_status &&
          (permissionStatus === ModificationPermissionsStatus.e_unmodified ||
            permissionStatus === ModificationPermissionsStatus.e_has_allowed_changes ||
            permissionStatus === ModificationPermissionsStatus.e_permissions_verification_disabled)
        ) {
          badgeIcon = 'digital_signature_warning';
        } else {
          badgeIcon = 'digital_signature_error';
        }

        if (signer) {
          signerName = signer;
        } else if (!signer && subjectField.e_commonName) {
          signerName = subjectField.e_commonName;
        }

        verificationResults[fieldName] = {
          signed,
          signer,
          signerName,
          signTime,
          verificationStatus,
          documentStatus,
          digestStatus,
          trustStatus,
          permissionStatus,
          disallowedChanges,
          trustVerificationResultString,
          timeOfTrustVerificationEnum,
          trustVerificationTime,
          id,
          badgeIcon,
          validSignerIdentity,
          digestAlgorithm,
          documentPermission,
          isCertification,
          contactInfo,
          location,
          reason,
          issuerField,
          subjectField,
          validAtTimeOfSigning,
        };
      } catch (e) {
        /**
         * @todo Add proper error handling when an error occurs?
         */
        // console.log(e);
      }
    }
  });

  return verificationResults;
};

/**
 * Retrieves the relevant information from the given object, containing date
 * information that originates from epoch time, and returns a string containing
 * the date and time information in a human readable string
 *
 * @param {object} date The date object that is returned from PDFNet
 * @returns {string} Human readable formatted date and time
 * @ignore
 */
const formatPDFNetDate = date => {
  const { year, month, day, hour, minute, second } = date;

  return `${year}-${month}-${day}, ${hour}:${minute}:${second}`;
};

/**
 * Converts an epoch time input to an instance of Javascript's Date class
 *
 * @param {Number} epochTime The epoch time to be converted
 * @returns {Date} The converted epoch time
 * @ignore
 */
const formatDate = epochTime => {
  const date = new Date(0);
  // Values greater than 59 are converted into their parent values
  // (i.e. seconds -> minutes -> hours -> day etc.)
  date.setUTCSeconds(epochTime);

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    weekday: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};

/**
 * Processes an instance of the PDFNet.X501DistinguishedName class into a
 * Javascript object that is human readable
 *
 * Intended to process the objects returned from invoking
 * PDFNet.X509Certificate.GetIssuerField and
 * PDFNet.X509Certificate.GetSubjectField
 *
 * @param {PDFNet.X501DistinguishedName} x501DistinguishedNameObject An instance
 * of the PDFNet.X501DistinguishedName class, to be processed into a Javascript
 * object
 * @returns {object} Maps human readable keys (as opposed to the Botan Crpyto
 * OIDs, represented as Array<int> in PDFTron Core) to the corresponding values
 * they map to
 * @ignore
 */
const processX501DistinguishedName = async x501DistinguishedNameObject => {
  const processedObject = {};
  const allAttributeAndValues = await x501DistinguishedNameObject.getAllAttributesAndValues();
  for (const x501AttributeTypeAndValue of allAttributeAndValues) {
    const objectIdentifier = await x501AttributeTypeAndValue.getAttributeTypeOID();
    const key = await objectIdentifier.getRawValue();
    const value = await x501AttributeTypeAndValue.getStringValue();
    processedObject[translateObjectIdentifierBotanOID(key)] = value;
  }
  return processedObject;
};

/**
 * Takes an Array<Number> argument (or its string representation from
 * JSON.stringify) and returns the enum it is supposed to represent based on
 * its OID representation in the Botan crypto C++ library
 *
 * PDFTron Core represents the key from the original Map<string, string>
 * data-structre in the form of an array
 *
 * @example The key of the object
 * { "2.5.4.3", "X520.CommonName" }
 * Is represented as [2,5,4,3] in PDFTron Core
 *
 * Source: https://botan.randombit.net/doxygen/oid__maps_8cpp_source.html
 *
 * @param {string | Array<Number>} objectIdentifierOIDenum The array returned
 * from the invocation of PDFNet.ObjectIdentifier.getRawValue, which can be
 * accepted as the Array input (which the body of the function will convert to a
 * string), or a string representation of the array
 * @returns {string} The human readable enum that the array represents
 * @ignore
 */
const translateObjectIdentifierBotanOID = objectIdentifierOIDenum => {
  const botanArrayToEnum = {
    '[2,5,4,3]': 'e_commonName',
    '[2,5,4,4]': 'e_surname',
    '[2,5,4,6]': 'e_countryName',
    '[2,5,4,7]': 'e_localityName',
    '[2,5,4,8]': 'e_stateOrProvinceName',
    '[2,5,4,9]': 'e_streetAddress',
    '[2,5,4,10]': 'e_organizationName',
    '[2,5,4,11]': 'e_organizationalUnitName',
    /**
     * @note Added by @CorreyL, enum is not in PDFTronCore codebase as of
     * PDFNetJS8.1
     *
     * Listed as { "1.2.840.113549.1.9.1", "PKCS9.EmailAddress" }
     * in load_oid2str_map()
     */
    '[1,2,840,113549,1,9,1]': 'e_emailAddress',
  };
  const arrayAsString = (typeof objectIdentifierOIDenum === 'string')
    ? objectIdentifierOIDenum
    : JSON.stringify(objectIdentifierOIDenum);
  return botanArrayToEnum[arrayAsString];
};
