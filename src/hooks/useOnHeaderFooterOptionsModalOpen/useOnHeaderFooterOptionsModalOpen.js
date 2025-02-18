import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import DataElements from 'constants/dataElement';
import { OfficeEditorHeaderFooterLayouts, CM_PER_INCH } from 'constants/officeEditor';

export default function useOnHeaderFooterOptionsModalOpen() {

  const dispatch = useDispatch();

  const isOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.HEADER_FOOTER_OPTIONS_MODAL));
  const [headerToTop, setHeaderToTop] = useState('');
  const [footerToBottom, setFooterToBottom] = useState('');
  const [layout, setLayout] = useState(OfficeEditorHeaderFooterLayouts.NO_SELECTION);

  const validateInput = (input) => {
    if (!input || input < 0) {
      return '0';
    }
    const validatedInput = input.replace(/^0+/, '');
    return validatedInput;
  };

  const onHeaderToTopChange = (e) => {
    const val = validateInput(e.target.value);
    setHeaderToTop(val);
  };

  const onFooterToBottomChange = (e) => {
    const val = validateInput(e.target.value);
    setFooterToBottom(val);
  };

  const onLayoutChange = (e) => {
    setLayout(e.target.value);
  };

  // Points are 1/72 of an inch
  const inchesToCMString = (inches) => {
    const val = (inches * CM_PER_INCH).toFixed(2);
    return val;
  };

  const stringCMToInches = (cm) => {
    const val = parseFloat(cm) / CM_PER_INCH;
    return val;
  };

  const onSave = async () => {
    dispatch(actions.closeElement(DataElements.HEADER_FOOTER_OPTIONS_MODAL));
    const headerToTopCM = stringCMToInches(headerToTop);
    const footerToBottomCM = stringCMToInches(footerToBottom);
    return Promise.all([
      core.getOfficeEditor().setHeaderFooterLayout(layout),
      core.getOfficeEditor().setHeaderFooterMarginsInInches(headerToTopCM, footerToBottomCM),
    ]);
  };

  useEffect(async () => {
    if (isOpen) {
      const { headerDistanceToTop, footerDistanceToBottom } = await core.getOfficeEditor().getHeaderFooterMarginsInInches();
      const headerDistanceToTopCM = inchesToCMString(headerDistanceToTop);
      const footerDistanceToBottomCM = inchesToCMString(footerDistanceToBottom);
      setHeaderToTop(headerDistanceToTopCM);
      setFooterToBottom(footerDistanceToBottomCM);

      const currentLayout = core.getOfficeEditor().getCurrentHeaderFooterLayout();
      setLayout(currentLayout);
    }
  }, [isOpen]);

  return { headerToTop, footerToBottom, layout, onHeaderToTopChange, onFooterToBottomChange, onLayoutChange, onSave };
}