import React from 'react';
import { useTranslation } from 'react-i18next';
import { Swipeable } from 'react-swipeable';

import { FocusTrap } from '@pdftron/webviewer-react-toolkit';
import Button from 'components/Button';
import './ModalWrapper.scss';

const SwipeableWrapper = (props) => {
  if (props.swipeToClose) {
    return (
      <Swipeable
        onSwipedUp={props.closeHandler}
        onSwipedDown={props.closeHandler}
        preventDefaultTouchmoveEvent
      >
        {props.children}
      </Swipeable>
    );
  }
  return props.children;
};

const ModalWrapper = (props) => {
  const [t] = useTranslation();

  return (
    <FocusTrap locked={props.isOpen}>
      <div
        className="modal-container"
        onClick={props.containerOnClick}
        role="dialog"
        aria-modal="true"
        aria-label={t(props.title)}
        aria-describedby={t(props.title)}
      >
        <div className="wrapper">
          <SwipeableWrapper {...props}>
            <div className="header-container">
              <div className='left-header'>
                <h2>{t(props.title)}</h2>
                {props.backButtonDataElement && (
                  <Button
                    className="back-button"
                    dataElement={props.backButtonDataElement}
                    title={t('action.back')}
                    img={'icon-arrow-back'}
                    onClick={props.onBackClick}
                  />
                )}
              </div>
              <Button
                className="close-button"
                dataElement={props.closeButtonDataElement}
                title="action.close"
                img="ic_close_black_24px"
                onClick={props.onCloseClick}
              />
            </div>
          </SwipeableWrapper>
          {props.children}
        </div>
      </div>
    </FocusTrap>
  );
};

export default ModalWrapper;