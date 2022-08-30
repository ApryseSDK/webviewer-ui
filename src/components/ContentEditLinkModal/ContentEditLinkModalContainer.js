import React, { useCallback } from 'react';
import ContentEditLinkModal from './ContentEditLinkModal';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'src/redux/actions';

const ContentEditLinkModalContainer = () => {
  const [
    isOpen,
    contentEditor,
  ] = useSelector((state) => [
    selectors.isElementOpen(state, DataElements.CONTENT_EDIT_LINK_MODAL),
    selectors.getContentEditor(state),
  ]);

  const dispatch = useDispatch();

  const existingLinkUrl = contentEditor?.getSelectedLinkURL() ? contentEditor.getSelectedLinkURL() : '';

  const closeModal = useCallback(() => {
    dispatch(actions.closeElement(DataElements.CONTENT_EDIT_LINK_MODAL));
    contentEditor.blur();
  }, [contentEditor]);


  const addLink = useCallback((url) => {
    contentEditor.format('link', url);
    contentEditor.blur();
  }, [contentEditor]);

  return isOpen ? (<ContentEditLinkModal closeModal={closeModal} addLinkHandler={addLink} existingLink={existingLinkUrl} />) : null;
};

export default ContentEditLinkModalContainer;