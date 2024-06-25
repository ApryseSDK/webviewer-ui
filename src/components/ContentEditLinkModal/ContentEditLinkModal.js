import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import DataElements from 'constants/dataElement';
import DataElementWrapper from 'components/DataElementWrapper';

import '../LinkModal/LinkModal.scss';

const ContentEditLinkModal = ({
  closeModal,
  addLinkHandler,
  existingLink,
}) => {
  const [url, setURL] = useState(existingLink);
  const [t] = useTranslation();

  const addURLLink = () => {
    addLinkHandler(url);
    closeModal();
  };

  return (
    <DataElementWrapper
      className="Modal LinkModal"
      data-element={DataElements.CONTENT_EDIT_LINK_MODAL}
      onMouseDown={closeModal}
    >
      <div className="container" onMouseDown={(e) => e.stopPropagation()}>
        <div className="header-container">
          <div className="header">
            <label>{t('link.insertLink')}</label>
            <Button img="icon-close" onClick={closeModal} title="action.close" />
          </div>
        </div>
        <div className="tab-panel">
          <div className="panel-body">
            <div className="add-url-link">
              <form onSubmit={addURLLink}>
                <label htmlFor="urlInput" className="inputLabel">{t('link.enterUrlAlt')}</label>
                <div className="linkInput">
                  <input
                    id="urlInput"
                    className="urlInput"
                    value={url}
                    autoFocus
                    onChange={(e) => setURL(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className="footer">
          <Button
            className="ok-button"
            dataElement="linkSubmitButton"
            label={t('action.link')}
            onClick={addURLLink}
            disabled={!url.length}
          />
        </div>
      </div>
    </DataElementWrapper>
  );
};

export default ContentEditLinkModal;