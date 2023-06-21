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
      <div className="modal-container" onClick={props.containerOnClick}>
        <div className="wrapper">
          <SwipeableWrapper {...props}>
            <div className="header-container">
              {t(props.title)}
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