import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import useOnFormFieldsChanged from '../../hooks/useOnFormFieldsChanged';
import core from 'core';
import selectors from 'selectors';
import FormFieldIndicator from './FormFieldIndicator';

import './FormFieldIndicator.scss';
import DataElements from 'src/constants/dataElement';

const FormFieldIndicatorContainer = () => {
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

  const getIndicators = () => {
    return formFieldAnnotationsList.map((fieldAnnotation) => createFormFieldIndicator(fieldAnnotation));
  };

  useEffect(() => {
    setIndicators(getIndicators());

    const onScroll = _.debounce(() => {
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

  const resetIndicators = () => {
    setIndicators([]);
  };

  useEffect(() => {
    core.addEventListener('documentUnloaded', resetIndicators);
    return () => {
      core.removeEventListener('documentUnloaded', resetIndicators);
    };
  }, []);

  const createFormFieldIndicator = (annotation) => {
    return <FormFieldIndicator key={`indicator_${annotation.Id}`} annotation={annotation} />;
  };

  if (isOpen && !isDisabled) {
    return <FormFieldIndicatorPortal>{indicators}</FormFieldIndicatorPortal>;
  }

  return null;
};

const FormFieldIndicatorPortal = ({ children }) => {
  const mount = document.getElementById('form-field-indicator-wrapper');
  const el = document.createElement('div');
  el.setAttribute('data-element', DataElements['FORM_FIELD_INDICATOR_CONTAINER']);

  useEffect(() => {
    mount.appendChild(el);
    return () => mount.removeChild(el);
  }, [el, mount]);
  return createPortal(children, el);
};

export default FormFieldIndicatorContainer;
