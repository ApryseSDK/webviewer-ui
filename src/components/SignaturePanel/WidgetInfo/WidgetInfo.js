import React, {
  useState,
} from 'react';
import {
  useSelector,
} from 'react-redux';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import selectors from 'selectors';

import SignatureIcon from 'components/SignaturePanel/SignatureIcon';
import Icon from 'components/Icon';

import './WidgetInfo.scss';

const propTypes = {
  name: PropTypes.string.isRequired,
  collapsible: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
};

const WidgetInfo = ({ name, collapsible, onClick = () => {} }) => {
  const verificationResult = useSelector(state => selectors.getVerificationResult(state, name));
  const [isExpanded, setIsExpanded] = useState(true);
  const [
    signatureDetailsExpanded,
    setSignatureDetailsExpanded,
  ] = useState(false);
  const { VerificationResult, VerificationOptions } = window.PDFNet;
  const { TimeMode } = VerificationOptions;
  const {
    TrustStatus,
    DigestStatus,
    ModificationPermissionsStatus,
    DocumentStatus,
  } = VerificationResult;

  const {
    signed,
    signer,
    signTime,
    id,
    verificationStatus,
    digestStatus,
    documentStatus,
    trustStatus,
    permissionStatus,
    disallowedChanges,
    trustVerificationResultString,
    timeOfTrustVerificationEnum,
    trustVerificationTime,
    badgeIcon,
    isCertification,
    contactInfo,
    location,
    reason,
    subjectField,
  } = verificationResult;

  const handleArrowClick = e => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const renderTitle = () => {
    let content = isCertification ? 'Certified' : 'Signed';
    if (signer) {
      content += ` by ${signer}`;
    } else if (!signer && subjectField.e_commonName) {
      content += ` by ${subjectField.e_commonName}`;
    }
    if (signTime) {
      content += ` on ${signTime}`;
    }
    return (
      <div
        className="title dropdown"
        onClick={handleArrowClick}
        onKeyPress={handleArrowClick}
        role="button"
        tabIndex={0}
      >
        {collapsible && (
          <div
            className={classNames({
              arrow: true,
              expanded: isExpanded,
            })}
          >
            <Icon glyph="ic_chevron_right_black_24px" />
          </div>
        )}
        <SignatureIcon badge={badgeIcon} />
        <p>{content}</p>
      </div>
    );
  };

  const renderVerificationStatus = () => {
    const verificationType = isCertification
      ? 'Certification'
      : 'Signature';
    return (
      <div className="title">
        <p>
          {
            verificationStatus
              ? `${verificationType} is valid.`
              : `${verificationType} verification failed.`
          }
        </p>
      </div>
    );
  };

  const renderDocumentStatus = () => {
    let content;

    switch (documentStatus) {
      case DocumentStatus.e_no_error:
        content = 'No general error to report.';
        break;
      case DocumentStatus.e_corrupt_file:
        content = 'SignatureHandler reported file corruption.';
        break;
      case DocumentStatus.e_unsigned:
        content = 'The signature has not yet been cryptographically signed.';
        break;
      case DocumentStatus.e_bad_byteranges:
        content = 'SignatureHandler reports corruption in the ByteRanges in the digital signature.';
        break;
      case DocumentStatus.e_corrupt_cryptographic_contents:
        content = 'SignatureHandler reports corruption in the Contents of the digital signature.';
        break;
    }

    return <p>{content}</p>;
  };

  const renderDigestStatus = () => {
    let content;

    switch (digestStatus) {
      case DigestStatus.e_digest_invalid:
        content = 'The digest is incorrect.';
        break;
      case DigestStatus.e_digest_verified:
        content = 'The digest is correct.';
        break;
      case DigestStatus.e_digest_verification_disabled:
        content = 'Digest verification has been disabled.';
        break;
      case DigestStatus.e_weak_digest_algorithm_but_digest_verifiable:
        content = 'The digest is correct, but the digest algorithm is weak and not secure.';
        break;
      case DigestStatus.e_no_digest_status:
        content = 'No digest status to report.';
        break;
      case DigestStatus.e_unsupported_encoding:
        content = 'No installed SignatureHandler was able to recognize the signature\'s encoding';
        break;
    }

    return <p>{content}</p>;
  };

  const renderTrustStatus = () => {
    let content;

    switch (trustStatus) {
      case TrustStatus.e_trust_verified:
        content = `Established trust in ${isCertification ? 'certifier' : 'signer'} successfully.`;
        break;
      case TrustStatus.e_untrusted:
        content = 'Trust could not be established.';
        break;
      case TrustStatus.e_trust_verification_disabled:
        content = 'Trust verification has been disabled.';
        break;
      case TrustStatus.e_no_trust_status:
        content = 'No trust status to report.';
        break;
    }

    return <p>{content}</p>;
  };

  const renderPermissionStatus = () => {
    let content;

    switch (permissionStatus) {
      case ModificationPermissionsStatus.e_invalidated_by_disallowed_changes:
        content =
          'The document has changes that are disallowed by the signature\'s permissions settings.';
        break;
      case ModificationPermissionsStatus.e_has_allowed_changes:
        content =
          'The document has changes that are allowed by the signature\'s permissions settings.';
        break;
      case ModificationPermissionsStatus.e_unmodified:
        content = `The document has not been modified since it was ${
          isCertification ? 'certified' : 'signed'
        }.`;
        break;
      case ModificationPermissionsStatus.e_permissions_verification_disabled:
        content = 'Permissions verification has been disabled.';
        break;
      case ModificationPermissionsStatus.e_no_permissions_status:
        content = 'No permissions status to report.';
        break;
    }

    return <p>{content}</p>;
  };

  const renderDisallowedChanges = () => {
    return disallowedChanges.map(({ objnum, type }) => (
      <p key={objnum}>
        Disallowed change: {type}, objnum: {objnum}
      </p>
    ));
  };

  const renderTrustVerification = () => {
    let verificationTimeMessage;
    switch (timeOfTrustVerificationEnum) {
      case (TimeMode.e_current):
        verificationTimeMessage = (
          'Verification time used was the current time'
        );
        break;
      case (TimeMode.e_signing):
        verificationTimeMessage = (
          'Verification time is from the clock on the signer\'s computer'
        );
        break;
      case (TimeMode.e_timestamp):
        verificationTimeMessage = (
          'Verification time is from the secure timestamp embedded in the document'
        );
        break;
      default:
        console.warn(
          `Unexpected pdftron::PDF::VerificationOptions::TimeMode: ${timeOfTrustVerificationEnum}`
        );
    }
    return trustVerificationResultString ? (
      <div className="trust-verification-result">
        <p>Trust verification result: Verified</p>
        {
          /**
           * @todo Chat with @rastko when he is available to determine what
           * content from `trustVerificationResultString` could potentially
           * be important to show to users
           *
           * <div>
           *   <p className='bold'>Trust verification result:</p>
           *   {
           *     trustVerificationResultString.split('\n').map((line, idx) => {
           *       return (
           *         <p
           *           key={`trustVerificationResultString-${idx}`}
           *           className={line[0] === '\t' ? '' : 'bold'}
           *         >
           *           {line}
           *         </p>
           *       );
           *     })
           *   }
           * </div>
           */
        }
        <p>{trustVerificationTime}</p>
        <p>{verificationTimeMessage}</p>
      </div>
    ) : (
      <p>No detailed trust verification result available.</p>
    );
  };

  const renderSignatureDetails = () => {
    // No additional signature details to render
    if (!contactInfo && !location && !reason) {
      return null;
    }
    return (
      <div>
        <div
          className="title dropdown"
          onClick={
            () => setSignatureDetailsExpanded(!signatureDetailsExpanded)
          }
          onKeyPress={
            () => setSignatureDetailsExpanded(!signatureDetailsExpanded)
          }
          role="button"
          tabIndex={0}
        >
          <div
            className={classNames({
              arrow: true,
              expanded: signatureDetailsExpanded,
            })}
          >
            <Icon glyph="ic_chevron_right_black_24px" />
          </div>
          <p>Signature Details</p>
        </div>
        {
          signatureDetailsExpanded
          && (
            <div className="body">
              <div>
                <p className="bold">Contact Information:</p>
                <p className="result-for-header">{contactInfo || 'No contact information provided'}</p>
              </div>
              <div>
                <p className="bold">Location:</p>
                <p className="result-for-header">{location || 'No location provided'}</p>
              </div>
              <div>
                <p className="bold">Reason:</p>
                <p className="result-for-header">{reason || 'No reason provided'}</p>
              </div>
              {
                signTime && (
                  <div>
                    <p className="bold">Signing Time:</p>
                    <p className="result-for-header">{signTime || 'No reason provided'}</p>
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    );
  };

  return (
    <div
      className="signature-widget-info"
      onClick={onClick}
      onKeyPress={onClick}
      role="button"
      tabIndex={0}
    >
      {signed ? (
        <React.Fragment>
          {renderTitle()}
          {isExpanded && (
            <div>
              <div className="header">
                {renderVerificationStatus()}
                <div className="body">
                  {renderDocumentStatus()}
                  {renderDigestStatus()}
                  {renderTrustStatus()}
                  {renderPermissionStatus()}
                  {renderDisallowedChanges()}
                  {renderTrustVerification()}
                </div>
              </div>
              <div className="header header-with-arrow">
                {renderSignatureDetails()}
              </div>
            </div>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="title">
            <SignatureIcon />
            <p>Unsigned signature field with object number {id}</p>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

WidgetInfo.propTypes = propTypes;

export default WidgetInfo;
