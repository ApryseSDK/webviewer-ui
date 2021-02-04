import React, {
  useState,
} from 'react';
import {
  useSelector,
} from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

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
  const [translate] = useTranslation();

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
    let content = isCertification
      ? translate('digitalSignatureVerification.Certified')
      : translate('digitalSignatureVerification.Signed');
    if (signer) {
      content += ` ${translate('digitalSignatureVerification.by')} ${signer}`;
    } else if (!signer && subjectField.e_commonName) {
      content += ` ${translate('digitalSignatureVerification.by')} ${subjectField.e_commonName}`;
    }
    if (signTime) {
      content += ` ${translate('digitalSignatureVerification.on')} ${signTime}`;
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
        content = translate(
          'digitalSignatureVerification.documentStatus.noError'
        );
        break;
      case DocumentStatus.e_corrupt_file:
        content = translate(
          'digitalSignatureVerification.documentStatus.corruptFile'
        );
        break;
      case DocumentStatus.e_unsigned:
        content = translate(
          'digitalSignatureVerification.documentStatus.unsigned'
        );
        break;
      case DocumentStatus.e_bad_byteranges:
        content = translate(
          'digitalSignatureVerification.documentStatus.badByteRanges'
        );
        break;
      case DocumentStatus.e_corrupt_cryptographic_contents:
        content = translate(
          'digitalSignatureVerification.documentStatus.corruptCryptographicContents'
        );
        break;
    }

    return <p>{content}</p>;
  };

  const renderDigestStatus = () => {
    let content;

    switch (digestStatus) {
      case DigestStatus.e_digest_invalid:
        content = translate(
          'digitalSignatureVerification.digestStatus.digestInvalid'
        );
        break;
      case DigestStatus.e_digest_verified:
        content = translate(
          'digitalSignatureVerification.digestStatus.digestVerified'
        );
        break;
      case DigestStatus.e_digest_verification_disabled:
        content = translate(
          'digitalSignatureVerification.digestStatus.digestVerificationDisabled'
        );
        break;
      case DigestStatus.e_weak_digest_algorithm_but_digest_verifiable:
        content = translate(
          'digitalSignatureVerification.digestStatus.weakDigestAlgorithmButDigestVerifiable'
        );
        break;
      case DigestStatus.e_no_digest_status:
        content = translate(
          'digitalSignatureVerification.digestStatus.noDigestStatus'
        );
        break;
      case DigestStatus.e_unsupported_encoding:
        content = translate(
          'digitalSignatureVerification.digestStatus.unsupportedEncoding'
        );
        break;
    }

    return <p>{content}</p>;
  };

  const renderTrustStatus = () => {
    const verificationType = isCertification
      ? translate('digitalSignatureVerification.certifier')
      : translate('digitalSignatureVerification.signer');
    let content;

    switch (trustStatus) {
      case TrustStatus.e_trust_verified:
        content = translate(
          'digitalSignatureVerification.trustStatus.trustVerified',
          { verificationType },
        );
        break;
      case TrustStatus.e_untrusted:
        content = translate(
          'digitalSignatureVerification.trustStatus.untrusted'
        );
        break;
      case TrustStatus.e_trust_verification_disabled:
        content = translate(
          'digitalSignatureVerification.trustStatus.trustVerificationDisabled'
        );
        break;
      case TrustStatus.e_no_trust_status:
        content = translate(
          'digitalSignatureVerification.trustStatus.noTrustStatus'
        );
        break;
    }

    return <p>{content}</p>;
  };

  const renderPermissionStatus = () => {
    let content;

    switch (permissionStatus) {
      case ModificationPermissionsStatus.e_invalidated_by_disallowed_changes:
        content = translate(
          'digitalSignatureVerification.permissionStatus.invalidatedByDisallowedChanges'
        );
        break;
      case ModificationPermissionsStatus.e_has_allowed_changes:
        content = translate(
          'digitalSignatureVerification.permissionStatus.hasAllowedChanges'
        );
        break;
      case ModificationPermissionsStatus.e_unmodified:
        content = `${
          translate('digitalSignatureVerification.permissionStatus.unmodified')
        } ${
          isCertification
            ? translate('digitalSignatureVerification.certified')
            : translate('digitalSignatureVerification.signed')
        }.`;
        break;
      case ModificationPermissionsStatus.e_permissions_verification_disabled:
        content = translate(
          'digitalSignatureVerification.permissionStatus.permissionsVerificationDisabled'
        );
        break;
      case ModificationPermissionsStatus.e_no_permissions_status:
        content = translate(
          'digitalSignatureVerification.permissionStatus.noPermissionsStatus'
        );
        break;
    }

    return <p>{content}</p>;
  };

  const renderDisallowedChanges = () => {
    return disallowedChanges.map(({ objnum, type }) => (
      <p key={objnum}>
        {
          translate(
            'digitalSignatureVerification.disallowedChange',
            { type, objnum }
          )
        }
      </p>
    ));
  };

  const renderTrustVerification = () => {
    let verificationTimeMessage;
    switch (timeOfTrustVerificationEnum) {
      case (TimeMode.e_current):
        verificationTimeMessage = (
          translate('digitalSignatureVerification.trustVerification.current')
        );
        break;
      case (TimeMode.e_signing):
        verificationTimeMessage = (
          translate('digitalSignatureVerification.trustVerification.signing')
        );
        break;
      case (TimeMode.e_timestamp):
        verificationTimeMessage = (
          translate('digitalSignatureVerification.trustVerification.timestamp')
        );
        break;
      default:
        console.warn(
          `Unexpected pdftron::PDF::VerificationOptions::TimeMode: ${timeOfTrustVerificationEnum}`
        );
    }
    return trustVerificationResultString ? (
      <div className="trust-verification-result">
        <p>
          {
            translate(
              'digitalSignatureVerification.trustVerification.verifiedTrust'
            )
          }
        </p>
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
      <p>
        {
          translate(
            'digitalSignatureVerification.trustVerification.noTrustVerification'
          )
        }
      </p>
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
          <p>
            {
              translate(
                'digitalSignatureVerification.signatureDetails.signatureDetails'
              )
            }
          </p>
        </div>
        {
          signatureDetailsExpanded
          && (
            <div className="body">
              <div>
                <p className="bold">
                  {
                    `${translate('digitalSignatureVerification.signatureDetails.contactInformation')}:`
                  }
                </p>
                <p className="result-for-header">
                  {
                    contactInfo
                    || translate('digitalSignatureVerification.signatureDetails.noContactInformation')
                  }
                </p>
              </div>
              <div>
                <p className="bold">
                  {
                    `${translate('digitalSignatureVerification.signatureDetails.location')}:`
                  }
                </p>
                <p className="result-for-header">
                  {
                    location
                    || translate('digitalSignatureVerification.signatureDetails.noLocation')
                  }
                </p>
              </div>
              <div>
                <p className="bold">
                  {
                    `${translate('digitalSignatureVerification.signatureDetails.reason')}:`
                  }
                </p>
                <p className="result-for-header">
                  {
                    reason
                    || translate('digitalSignatureVerification.signatureDetails.noReason')
                  }
                </p>
              </div>
              {
                signTime && (
                  <div>
                    <p className="bold">
                      {
                        `${translate('digitalSignatureVerification.signatureDetails.signingTime')}:`
                      }
                    </p>
                    <p className="result-for-header">
                      {
                        signTime
                        || translate('digitalSignatureVerification.signatureDetails.noSigningTime')
                      }
                    </p>
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
