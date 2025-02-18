import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import actions from 'actions';
import classNames from 'classnames';
import DataElements from 'constants/dataElement';
import Button from 'components/Button';
import ModalWrapper from 'components/ModalWrapper';
import { Choice, Input } from '@pdftron/webviewer-react-toolkit';
import PropTypes from 'prop-types';
import { OfficeEditorHeaderFooterLayouts } from 'constants/officeEditor';

import './HeaderFooterOptionsModal.scss';

const propTypes = {
  headerToTop: PropTypes.string,
  footerToBottom: PropTypes.string,
  layout: PropTypes.string,
  onHeaderToTopChange: PropTypes.func,
  onFooterToBottomChange: PropTypes.func,
  onLayoutChange: PropTypes.func,
  onSave: PropTypes.func,
};

const HeaderFooterOptionsModal = ({ headerToTop, footerToBottom, layout, onHeaderToTopChange, onFooterToBottomChange, onLayoutChange, onSave }) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const isOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.HEADER_FOOTER_OPTIONS_MODAL));

  const closeModal = () => {
    dispatch(actions.closeElement(DataElements.HEADER_FOOTER_OPTIONS_MODAL));
  };

  const preventDefault = (e) => e.preventDefault();

  const modalClass = classNames({
    'HeaderFooterOptionsModal': true
  });

  return isOpen && (
    <div className={modalClass} data-element={DataElements.HEADER_FOOTER_OPTIONS_MODAL}>
      <ModalWrapper
        isOpen={isOpen}
        title={t('officeEditor.headerFooterOptionsModal.title')}
        closehandler={closeModal}
        onCloseClick={closeModal}
        swipeToClose
      >
        <div className='modal-body'>
          <div className='title'>{t('officeEditor.headerFooterOptionsModal.margins')}</div>
          <div className='input-container'>
            <label htmlFor='headerToTopInput' className='label'>{t('officeEditor.headerFooterOptionsModal.headerFromTop')}</label>
            <Input
              type='number'
              id='headerToTopInput'
              data-testid="headerToTopInput"
              onChange={onHeaderToTopChange}
              value={headerToTop}
              min='0'
              step='any'
            />
          </div>
          <div className='input-container'>
            <label htmlFor='footerToBottomInput' className='label'>{t('officeEditor.headerFooterOptionsModal.footerFromBottom')}</label>
            <Input
              type='number'
              id='footerToBottomInput'
              data-testid="footerToBottomInput"
              onChange={onFooterToBottomChange}
              value={footerToBottom}
              min='0'
              step='any'
            />
          </div>
          <div className='title'>{t('officeEditor.headerFooterOptionsModal.layouts.layout')}</div>
          <form className='radio-container' onChange={onLayoutChange} onSubmit={preventDefault}>
            <Choice
              checked={layout === OfficeEditorHeaderFooterLayouts.NO_SELECTION}
              radio
              name='layout-option'
              label={t('officeEditor.headerFooterOptionsModal.layouts.noSelection')}
              value={OfficeEditorHeaderFooterLayouts.NO_SELECTION}
            />
            <Choice
              checked={layout === OfficeEditorHeaderFooterLayouts.DIFFERENT_FIRST_PAGE}
              radio
              name='layout-option'
              label={t('officeEditor.headerFooterOptionsModal.layouts.differentFirstPage')}
              value={OfficeEditorHeaderFooterLayouts.DIFFERENT_FIRST_PAGE}
            />
            <Choice
              checked={layout === OfficeEditorHeaderFooterLayouts.DIFFERENT_EVEN_ODD_PAGES}
              radio
              name='layout-option'
              label={t('officeEditor.headerFooterOptionsModal.layouts.differentEvenOddPages')}
              value={OfficeEditorHeaderFooterLayouts.DIFFERENT_EVEN_ODD_PAGES}
            />
            <Choice
              checked={layout === OfficeEditorHeaderFooterLayouts.DIFFERENT_FIRST_AND_EVEN_ODD_PAGES}
              radio
              name='layout-option'
              label={t('officeEditor.headerFooterOptionsModal.layouts.differentFirstEvenOddPages')}
              value={OfficeEditorHeaderFooterLayouts.DIFFERENT_FIRST_AND_EVEN_ODD_PAGES}
            />
          </form>
        </div>
        <div className='footer'>
          <Button onClick={onSave} label={t('action.save')} />
        </div>
      </ModalWrapper>
    </div>
  );
};

HeaderFooterOptionsModal.propTypes = propTypes;

export default HeaderFooterOptionsModal;
