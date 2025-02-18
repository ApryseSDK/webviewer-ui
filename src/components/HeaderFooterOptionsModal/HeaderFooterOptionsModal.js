import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import actions from 'actions';
import classNames from 'classnames';
import DataElements from 'constants/dataElement';
import Button from 'components/Button';
import ModalWrapper from 'components/ModalWrapper';
import { Choice, Input } from '@pdftron/webviewer-react-toolkit';

import './HeaderFooterOptionsModal.scss';

const LAYOUTS = {
  NONE: 'none',
  FIRST: 'first',
  EVEN_ODD: 'even_odd',
  FIRST_EVEN_ODD: 'first_even_odd',
};

const HeaderFooterOptionsModal = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const [headerFromTop, setHeaderFromTop] = useState('0');
  const [footerFromBottom, setFooterFromBottom] = useState('0');
  const [layout, setLayout] = useState(LAYOUTS.NONE);

  const isOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.HEADER_FOOTER_OPTIONS_MODAL));

  const closeModal = () => {
    dispatch(actions.closeElement(DataElements.HEADER_FOOTER_OPTIONS_MODAL));
  };

  const preventDefault = (e) => e.preventDefault();

  const validateInput = (input) => {
    if (!input || input < 0) {
      return 0;
    }
    const validatedInput = input.replace(/^0+/, '');
    return validatedInput;
  };

  const onHeaderFromTopChange = (e) => {
    const val = validateInput(e.target.value);
    setHeaderFromTop(val);
  };

  const onFooterFromBottomChange = (e) => {
    const val = validateInput(e.target.value);
    setFooterFromBottom(val);
  };

  const onLayoutChange = (e) => {
    setLayout(e.target.value);
  };

  const onSave = () => {
    closeModal();
  };

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
            <label htmlFor='headerFromTopInput' className='label'>{t('officeEditor.headerFooterOptionsModal.headerFromTop')}</label>
            <Input
              type='number'
              id='headerFromTopInput'
              data-testid="headerFromTopInput"
              onChange={onHeaderFromTopChange}
              value={headerFromTop}
              min='0'
              step='any'
            />
          </div>
          <div className='input-container'>
            <label htmlFor='footerFromBottomInput' className='label'>{t('officeEditor.headerFooterOptionsModal.footerFromBottom')}</label>
            <Input
              type='number'
              id='footerFromBottomInput'
              data-testid="footerFromBottomInput"
              onChange={onFooterFromBottomChange}
              value={footerFromBottom}
              min='0'
              step='any'
            />
          </div>
          <div className='title'>{t('officeEditor.headerFooterOptionsModal.layouts.layout')}</div>
          <form className='radio-container' onChange={onLayoutChange} onSubmit={preventDefault}>
            <Choice
              checked={layout === LAYOUTS.NONE}
              radio
              name='layout-option'
              label={t('officeEditor.headerFooterOptionsModal.layouts.noSelection')}
              value={LAYOUTS.NONE}
            />
            <Choice
              checked={layout === LAYOUTS.FIRST}
              radio
              name='layout-option'
              label={t('officeEditor.headerFooterOptionsModal.layouts.differentFirstPage')}
              value={LAYOUTS.FIRST}
            />
            <Choice
              checked={layout === LAYOUTS.EVEN_ODD}
              radio
              name='layout-option'
              label={t('officeEditor.headerFooterOptionsModal.layouts.differentEvenOddPages')}
              value={LAYOUTS.EVEN_ODD}
            />
            <Choice
              checked={layout === LAYOUTS.FIRST_EVEN_ODD}
              radio
              name='layout-option'
              label={t('officeEditor.headerFooterOptionsModal.layouts.differentFirstEvenOddPages')}
              value={LAYOUTS.FIRST_EVEN_ODD}
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

export default HeaderFooterOptionsModal;
