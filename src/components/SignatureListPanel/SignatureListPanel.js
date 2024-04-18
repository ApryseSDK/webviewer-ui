import React, { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector, shallowEqual, useStore } from 'react-redux';
import DataElementWrapper from '../DataElementWrapper';
import defaultTool from 'constants/defaultTool';
import DataElements from 'constants/dataElement';
import SignatureModes from 'constants/signatureModes';
import { PANEL_SIZES, panelNames } from 'constants/panel';
import { isMobileSize } from 'helpers/getDeviceSize';
import setToolModeAndGroup from 'helpers/setToolModeAndGroup';
import selectors from 'selectors';
import actions from 'actions';
import classNames from 'classnames';
import './SignatureListPanel.scss';
import Divider from '../ModularComponents/Divider';
import SavedSignatures from './SavedSignatures';
import SignatureAddButton from './SignatureAddButton';
import core from 'core';
import PropTypes from 'prop-types';
import Events from 'constants/events';

const SignatureListPanel = ({ panelSize }) => {
  const [t] = useTranslation();
  const isMobile = isMobileSize();

  const [
    savedSignatures,
    maxSignaturesCount,
    displayedSignaturesFilterFunction,
    isSignatureDeleteButtonDisabled,
    savedInitials,
    selectedSignatureIndex,
    signatureMode,
    mobilePanelSize
  ] = useSelector(
    (state) => [
      selectors.getSavedSignatures(state),
      selectors.getMaxSignaturesCount(state),
      selectors.getDisplayedSignaturesFilterFunction(state),
      selectors.isElementDisabled(state, 'defaultSignatureDeleteButton'),
      selectors.getSavedInitials(state),
      selectors.getSelectedDisplayedSignatureIndex(state),
      selectors.getSignatureMode(state),
      selectors.getMobilePanelSize(state),
    ],
    shallowEqual,
  );
  const store = useStore();
  const TOOL_NAME = 'AnnotationCreateSignature';
  const signatureToolArray = core.getToolsFromAllDocumentViewers(TOOL_NAME);

  useEffect(() => {
    return () => {
      for (const signatureTool of signatureToolArray) {
        signatureTool.clearLocation();
        signatureTool.setSignature(null);
        signatureTool.setInitials(null);
      }
    };
  }, []);

  // Saved signatures and initials are now in a single object. Merge them
  const [savedSignaturesAndInitials, setSavedSignaturesAndInitials] = React.useState([]);
  useEffect(() => {
    const signaturesToDisplay = savedSignatures.filter((signature, index) => displayedSignaturesFilterFunction(signature, index));
    const mergedSignaturesAndInitals = signaturesToDisplay.map((signature, index) => {
      return {
        fullSignature: signature,
        initials: savedInitials[index] || null,
      };
    });
    setSavedSignaturesAndInitials(mergedSignaturesAndInitals);
  }, [savedSignatures, savedInitials, displayedSignaturesFilterFunction]);

  useEffect(() => {
    if (mobilePanelSize !== PANEL_SIZES.SMALL_SIZE && isMobile) {
      dispatch(actions.setMobilePanelSize(PANEL_SIZES.SMALL_SIZE));
    }
  }, [selectedSignatureIndex]);

  useEffect(() => {
    const onVisibilityChanged = (e) => {
      const activeTool = core.getToolMode();
      const activeToolName = activeTool?.name;
      const { element, isVisible } = e.detail;
      if (element === panelNames.SIGNATURE_LIST && !isVisible) {
        if (activeToolName === TOOL_NAME || activeToolName === defaultTool) {
          setToolModeAndGroup(store, defaultTool);
        }
      }
    };

    window.addEventListener(Events.VISIBILITY_CHANGED, onVisibilityChanged);
    return () => {
      window.removeEventListener(Events.VISIBILITY_CHANGED, onVisibilityChanged);
    };
  }, []);

  const dispatch = useDispatch();

  const setSignature = useCallback(async (index) => {
    const { fullSignature } = savedSignaturesAndInitials[index];
    const { annotation } = fullSignature;
    dispatch(actions.setSelectedDisplayedSignatureIndex(index));
    core.setToolMode(TOOL_NAME);
    for (const signatureTool of signatureToolArray) {
      await signatureTool.setSignature(annotation);
      if (signatureTool.hasLocation()) {
        await signatureTool.addSignature();
      } else {
        await signatureTool.showPreview();
        dispatch(actions.setSignatureMode(SignatureModes.FULL_SIGNATURE));
      }
    }
  }, [savedSignaturesAndInitials]);

  const setInitials = useCallback((async (index) => {
    const { initials } = savedSignaturesAndInitials[index];
    const { annotation } = initials;
    dispatch(actions.setSelectedDisplayedSignatureIndex(index));
    core.setToolMode(TOOL_NAME);
    for (const signatureTool of signatureToolArray) {
      await signatureTool.setInitials(annotation);
      if (signatureTool.hasLocation()) {
        await signatureTool.addInitials();
        // Default mode is fullSignature. If we dont reset it here there can be a bug where
        // we preview the initials, but apply the full signature
        dispatch(actions.setSignatureMode(SignatureModes.FULL_SIGNATURE));
      } else {
        await signatureTool.showInitialsPreview();
        dispatch(actions.setSignatureMode(SignatureModes.INITIALS));
      }
    }
  }), [savedSignaturesAndInitials]);

  const deleteSignatureAndInitials = useCallback(async (index) => {
    signatureToolArray[0].deleteSavedInitials(index);
    signatureToolArray[0].deleteSavedSignature(index);
    const remainingSignatures = signatureToolArray[0].getSavedSignatures();
    const isDeletingSelectedSignature = selectedSignatureIndex === index;

    if (isDeletingSelectedSignature) {
      signatureToolArray.forEach((signatureTool) => {
        signatureTool.hidePreview();
        signatureTool.setSignature(null);
        signatureTool.setInitials(null);
      });
      core.setToolMode(defaultTool);
    }

    if (remainingSignatures.length === 0) {
      dispatch(actions.setSelectedDisplayedSignatureIndex(null));
    } else {
      let newIndex = selectedSignatureIndex;
      if (isDeletingSelectedSignature || index < selectedSignatureIndex) {
        newIndex = Math.max(0, selectedSignatureIndex - 1);
      }
      dispatch(actions.setSelectedDisplayedSignatureIndex(newIndex));
    }
  }, [selectedSignatureIndex]);


  return (
    <DataElementWrapper dataElement={DataElements.SIGNATURE_LIST_PANEL} className={
      classNames({
        'Panel': true,
        'SignatureListPanel': true,
        'hideAddButton': savedSignatures.length && panelSize === PANEL_SIZES.SMALL_SIZE,
        [panelSize]: true,
      })
    }>
      <div className='signature-list-panel-header'>
        {t('signatureListPanel.header')}
      </div>
      <SignatureAddButton isDisabled={savedSignaturesAndInitials.length >= maxSignaturesCount} />
      <Divider />
      <SavedSignatures
        savedSignatures={savedSignaturesAndInitials}
        onFullSignatureSetHandler={setSignature}
        onInitialsSetHandler={setInitials}
        deleteHandler={deleteSignatureAndInitials}
        currentlySelectedSignature={selectedSignatureIndex}
        isDeleteDisabled={isSignatureDeleteButtonDisabled}
        signatureMode={signatureMode}
        panelSize={panelSize} />
    </DataElementWrapper>
  );
};

SignatureListPanel.propTypes = {
  panelSize: PropTypes.oneOf(Object.values(PANEL_SIZES)),
};

export default SignatureListPanel;