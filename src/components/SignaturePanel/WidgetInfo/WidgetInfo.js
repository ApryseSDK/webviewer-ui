import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import actions from 'actions';
import classNames from 'classnames';
import core from 'core';
import selectors from 'selectors';

import WidgetLocator from '../WidgetLocator';
import useFocusHandler from 'hooks/useFocusHandler';
import PanelListItem from 'src/components/PanelListItem';
import Button from 'src/components/Button';

import './WidgetInfo.scss';

export const renderPermissionStatus = ({
  isCertification,
  ModificationPermissionsStatus,
  permissionStatus,
  translate,
}) => {
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
      content = `${translate('digitalSignatureVerification.permissionStatus.unmodified')
      } ${isCertification
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

const propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  field: PropTypes.instanceOf(window.Core.Annotations.Forms.Field),
};

const WidgetInfo = ({ name, field }) => {
  const verificationResult = useSelector((state) => selectors.getVerificationResult(state, name));
  const [locatorRect, setLocatorRect] = useState(null);
  const [signatureDetailsExpanded, setSignatureDetailsExpanded] = useState(false);
  const { VerificationResult, VerificationOptions } = window.Core.PDFNet;
  const { TimeMode } = VerificationOptions;
  const { ModificationPermissionsStatus } = VerificationResult;
  const [translate] = useTranslation();

  const {
    signed,
    signTime,
    verificationStatus,
    permissionStatus,
    disallowedChanges,
    trustVerificationResultBoolean,
    timeOfTrustVerificationEnum,
    trustVerificationTime,
    badgeIcon,
    isCertification,
    contactInfo,
    location,
    reason,
    signerName,
  } = verificationResult;

  const dispatch = useDispatch();

  /**
   * Side-effect function that highlights the SignatureWidgetAnnotation
   * pertaining to the text element that was clicked by using core code to find
   * the coordinates of the widget on the page it is placed on
   *
   * @param {Annotations.Forms.Field} field The field pertaining
   * to the text element clicked in the Signature Panel
   */
  const jumpToWidget = (field) => {
    if (!field.widgets.length) {
      return;
    }
    const widget = field.widgets[0];
    core.jumpToAnnotation(widget);

    const { scrollLeft, scrollTop } = core.getScrollViewElement();
    const rect = widget.getRect();
    const windowTopLeft = core
      .getDisplayModeObject()
      .pageToWindow({ x: rect.x1, y: rect.y1 }, widget.PageNumber);
    const windowBottomRight = core
      .getDisplayModeObject()
      .pageToWindow({ x: rect.x2, y: rect.y2 }, widget.PageNumber);

    setLocatorRect({
      x1: windowTopLeft.x - scrollLeft,
      y1: windowTopLeft.y - scrollTop,
      x2: windowBottomRight.x - scrollLeft,
      y2: windowBottomRight.y - scrollTop,
    });
  };

  /**
   * Function that invokes the necessary methods when a user interacts with
   * the title of the widget
   *
   * interaction
   */
  const titleInteraction = () => {
    jumpToWidget(field);
  };

  const renderVerificationStatus = () => {
    const verificationType = isCertification
      ? translate('digitalSignatureVerification.Certification')
      : translate('digitalSignatureVerification.Signature');
    return (
      <div className="title">
        <p>
          {
            verificationStatus
              ? translate('digitalSignatureVerification.verificationStatus.valid', { verificationType })
              : translate('digitalSignatureVerification.verificationStatus.failed', { verificationType })
          }
        </p>
      </div>
    );
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
        content = `${translate('digitalSignatureVerification.permissionStatus.unmodified')
        } ${isCertification
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

    return (
      <li>
        <p>
          {content}
        </p>
      </li>
    );
  };

  const renderDisallowedChanges = () => {
    return disallowedChanges.map(({ objnum, type }) => (
      <li key={objnum}>
        <p>
          {
            translate(
              'digitalSignatureVerification.disallowedChange',
              { type, objnum }
            )
          }
        </p>
      </li>
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
    return (
      <>
        <li>
          <p>
            {
              translate(
                trustVerificationResultBoolean
                  ? 'digitalSignatureVerification.trustVerification.verifiedTrust'
                  : 'digitalSignatureVerification.trustVerification.noTrustVerification'
              )
            }
          </p>
        </li>
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
        <li>
          <p>
            {trustVerificationTime}
          </p>
        </li>
        <li>
          <p>
            {verificationTimeMessage}
          </p>
        </li>
      </>
    );
  };

  const renderSignatureDetails = () => {
    // No additional signature details to render
    if (!contactInfo && !location && !reason) {
      return null;
    }
    return (
      <div
        className='signatureDetails'
        tabIndex={-1}
      >
        <div className="title collapsible">
          <Button
            img="icon-chevron-right"
            className={classNames({
              arrow: true,
              expanded: signatureDetailsExpanded,
            })}
            role="button"
            ariaExpanded={signatureDetailsExpanded}
            isActive={signatureDetailsExpanded}
            ariaLabel={translate('digitalSignatureVerification.signatureDetails.signatureDetails')}
            onClick={
              () => setSignatureDetailsExpanded(!signatureDetailsExpanded)
            }
          />
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
            <ul className="body">
              <li>
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
              </li>
              <li>
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
              </li>
              <li>
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
              </li>
              {
                signTime && (
                  <li>
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
                  </li>
                )
              }
            </ul>
          )
        }
      </div>
    );
  };

  const openSignatureModal = () => {
    dispatch(actions.setSignatureValidationModalWidgetName(name));
    dispatch(actions.openElement('signatureValidationModal'));
  };

  const openSignatureModalWithFocus = useFocusHandler(openSignatureModal);

  /**
   * Renders a button to open the signature modal
   */
  const renderSignaturePropertiesButton = () => {
    return (
      <li>
        <button
          data-element={`signatureProperties-${name}`}
          onClick={openSignatureModalWithFocus}
          tabIndex={0}
          className="signatureProperties link"
          aria-label='Open signature properties modal'
        >
          <p className="bold underline">
            {translate('digitalSignatureVerification.signatureProperties')}
          </p>
        </button>
      </li>
    );
  };

  const getRenderTitle = () => {
    let content = isCertification
      ? translate('digitalSignatureVerification.Certified')
      : translate('digitalSignatureVerification.Signed');
    content += ` ${translate('digitalSignatureVerification.by')} ${signerName || translate('digitalSignatureModal.unknown')}`;
    if (signTime) {
      content += ` ${translate('digitalSignatureVerification.on')} ${signTime}`;
    }
    return content;
  };

  return (
    <div className="signature-widget-info">
      {signed ? (
        <React.Fragment>
          <PanelListItem
            labelHeader={getRenderTitle()}
            iconGlyph={badgeIcon}
            useI18String={false}
            onClick={titleInteraction}
            onKeyDown={titleInteraction}
          >
            <div
              className='verificationDetails'
              tabIndex={-1}
            >
              <div className="header">
                {
                  renderVerificationStatus({
                    isCertification,
                    verificationStatus,
                  })
                }
                <ul className="body">
                  {
                    renderPermissionStatus({
                      isCertification,
                      ModificationPermissionsStatus,
                      permissionStatus,
                      translate,
                    })
                  }
                  {renderDisallowedChanges()}
                  {renderTrustVerification()}
                  {renderSignaturePropertiesButton()}
                </ul>
              </div>
            </div>
            <div className="header header-with-arrow">
              {renderSignatureDetails()}
            </div>
          </PanelListItem>
        </React.Fragment>
      ) : (
        <PanelListItem
          labelHeader={translate('digitalSignatureVerification.unsignedSignatureField', { fieldName: field.name })}
          iconGlyph='digital_signature_empty'
          useI18String={false}
          onClick={titleInteraction}
          onKeyDown={titleInteraction}
        />
      )}
      <WidgetLocator rect={locatorRect} />
    </div>
  );
};

WidgetInfo.propTypes = propTypes;

export default WidgetInfo;
