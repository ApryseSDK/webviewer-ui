import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import useOnFormFieldsChanged from '../../hooks/useOnFormFieldsChanged';
import useCore from 'hooks/useCore';
import selectors from 'selectors';
import FormFieldIndicator from './FormFieldIndicator';
import './FormFieldIndicator.scss';
import DataElements from 'src/constants/dataElement';
import getRootNode from 'helpers/getRootNode';
import InstanceRootNodeContext from 'src/context/InstanceRootNodeContext';
import { createPortal } from 'react-dom';

const FormFieldIndicatorContainer = () => {
  const { core } = useCore();
  const instanceRootNode = useContext(InstanceRootNodeContext);
  const [
    isOpen,
    isDisabled,
    documentContainerWidth,
    documentContainerHeight,
    leftPanelWidth,
    notePanelWidth,
  ] = useSelector((state) => [
    selectors.isElementOpen(state, DataElements['FORM_FIELD_INDICATOR_CONTAINER']),
    selectors.isElementDisabled(state, DataElements['FORM_FIELD_INDICATOR_CONTAINER']),
    selectors.getDocumentContainerWidth(state),
    selectors.getDocumentContainerHeight(state),
    selectors.getLeftPanelWidth(state),
    selectors.getDocumentContentContainerWidthStyle(state),
    selectors.getNotesPanelWidth(state),
  ]);
  const formFieldAnnotationsList = useOnFormFieldsChanged();
  const [indicators, setIndicators] = useState([]);
  const isMultiViewerMode = useSelector(selectors.isMultiViewerMode);

  // Resolve THIS instance's root (its ShadowRoot in WebComponent mode) from context rather than the module-level getRootNode() singleton, which in multi-instance WC mode points to the most-recently-registered instance and would otherwise portal #form-field-indicator-wrapper into ANOTHER instance's #app, causing an intermittent React "removeChild ... not a child" crash on re-render.
  const getInstanceRootNode = () => instanceRootNode || getRootNode();

  const getIndicators = () => {
    if (!core.getDocument()) {
      return [];
    }
    return formFieldAnnotationsList
      .filter((fieldAnnotation) => {
        return fieldAnnotation.getCustomData('trn-form-field-show-indicator') === 'true';
      })
      .map((fieldAnnotation) => {
        return createFormFieldIndicator(fieldAnnotation);
      });
  };

  const resetIndicators = () => {
    setIndicators([]);
  };

  useEffect(() => {
    core.addEventListener('documentUnloaded', resetIndicators);
    return () => {
      core.removeEventListener('documentUnloaded', resetIndicators);
    };
  }, []);

  useEffect(() => {
    setIndicators(getIndicators());

    const onScroll = debounce(() => {
      if (isOpen && !isDisabled) {
        setIndicators(getIndicators());
      }
    }, 0);

    const scrollViewElement = core.getScrollViewElement();

    scrollViewElement?.addEventListener('scroll', onScroll);
    return () => {
      scrollViewElement?.removeEventListener('scroll', onScroll);
    };
  }, [
    formFieldAnnotationsList,
    isOpen,
    isDisabled,
    documentContainerWidth,
    documentContainerHeight,
    leftPanelWidth,
    notePanelWidth,
  ]);

  const createFormFieldIndicator = (annotation) => {
    const { scrollLeft, scrollTop } = core.getScrollViewElement();
    const payload = {
      displayMode: core
        .getDocumentViewer()
        .getDisplayModeManager()
        .getDisplayMode(),
      viewerBoundingRect: core.getViewerElement().getBoundingClientRect(),
      appBoundingRect: getInstanceRootNode()
        .getElementById('app')
        .getBoundingClientRect(),
      scrollLeft: scrollLeft,
      scrollTop: scrollTop,
    };
    return <FormFieldIndicator key={`indicator_${annotation.Id}`} annotation={annotation} parameters={payload} />;
  };

  if (isOpen && !isDisabled && !isMultiViewerMode) {
    return (
      <>
        {createPortal(
          <div id="form-field-indicator-wrapper">
            <div data-element={DataElements['FORM_FIELD_INDICATOR_CONTAINER']}>{indicators}</div>
          </div>,
          window.isApryseWebViewerWebComponent ? getInstanceRootNode().getElementById('app') : document.body,
        )}
      </>
    );
  }

  return null;
};

export default FormFieldIndicatorContainer;
