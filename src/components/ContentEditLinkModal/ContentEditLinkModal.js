import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import DataElements from 'constants/dataElement';

import classNames from 'classnames';
import DataElementWrapper from 'components/DataElementWrapper';

const ContentEditLinkModal = ({
  closeModal,
  addLinkHandler,
  existingLink,
}) => {
  const [url, setURL] = useState(existingLink);
  const [t] = useTranslation();

  const modalClass = classNames({
    Modal: true,
    LinkModal: true,
  });

  const addURLLink = () => {
    addLinkHandler(url);
    closeModal();
  };


  return (
    <DataElementWrapper
      className={modalClass}
      data-element={DataElements.CONTENT_EDIT_LINK_MODAL}
      onMouseDown={closeModal}
    >
      <div className="container" onMouseDown={(e) => e.stopPropagation()}>
        <form onSubmit={addURLLink}>
          <div>{t('link.enterurl')}</div>
          <div className="linkInput">
            <input
              className="urlInput"
              value={url}
              autoFocus
              onChange={(e) => setURL(e.target.value)}
            />
            <Button
              dataElement="linkSubmitButton"
              label={t('action.link')}
              onClick={addURLLink}
            />
          </div>
        </form>
      </div>
    </DataElementWrapper>
  );
};

export default ContentEditLinkModal;