import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Swipeable } from 'react-swipeable';
import Button from 'components/Button';
import FocusTrap from 'components/FocusTrap';
import ErrorBoundaryComponent from 'components/ErrorBoundaryComponent';
import COMPONENT_TYPES from 'constants/componentTypes';
import PropTypes from 'prop-types';
import './ModalWrapper.scss';
import selectors from 'selectors';
import useFocusOnClose from 'hooks/useFocusOnClose';
import { isMobileSize } from 'helpers/getDeviceSize';
import { useSelector } from 'react-redux';

const SwipeableWrapper = ({
  onSwipedDown,
  onSwipedUp,
  closeHandler,
  swipeToClose = false,
  children,
}) => {
  return swipeToClose ? (
    <Swipeable
      onSwipedUp={onSwipedUp || closeHandler}
      onSwipedDown={onSwipedDown || closeHandler}
      preventDefaultTouchmoveEvent
    >
      {children}
    </Swipeable>
  ) : (
    children
  );
};

SwipeableWrapper.propTypes = {
  onSwipedDown: PropTypes.func,
  onSwipedUp: PropTypes.func,
  closeHandler: PropTypes.func,
  swipeToClose: PropTypes.bool,
  children: PropTypes.node,
};

const ModalWrapper = React.forwardRef((props, ref) => {
  const [t] = useTranslation();
  const onCloseHandler = useFocusOnClose(props.onCloseClick);
  const isMobile = isMobileSize();
  const isInDesktopOnlyMode = useSelector(selectors.isInDesktopOnlyMode);
  const shouldUseMobileWrapper = isMobile && !isInDesktopOnlyMode;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && props.isOpen) {
        onCloseHandler();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCloseHandler, props.isOpen]);

  const renderHeader = () => {
    if (props.title) {
      return (
        <div className="header-container">
          <div className="left-header">
            <h2>{t(props.title)}</h2>
            {props.backButtonDataElement && (
              <Button
                className="back-button"
                dataElement={props.backButtonDataElement}
                title={t('action.back')}
                img={'icon-arrow-back'}
                onClick={props.onBackClick}
                ariaLabel={t('action.back')}
              />
            )}
          </div>
          <Button
            className="close-button"
            dataElement={props.closeButtonDataElement}
            title='action.close'
            img="ic_close_black_24px"
            onClick={onCloseHandler}
            ariaLabel={t('action.close')}
          />
        </div>
      );
    }
    return null;
  };

  const accessibleLabel = props.accessibleLabel ? t(props.accessibleLabel) : t(props.title);

  return (
    <FocusTrap locked={props.isOpen} ref={ref}>
      <div
        className="modal-container"
        onClick={props.containerOnClick}
        role="dialog"
        aria-modal="true"
        aria-label={accessibleLabel}
      >
        <div className="wrapper">
          <SwipeableWrapper {...props}>
            {
              shouldUseMobileWrapper && (
                <div className="swipe-indicator" />
              )
            }
            {renderHeader()}
          </SwipeableWrapper>
          <ErrorBoundaryComponent
            dataElement={props.modalDataElement}
            componentType={COMPONENT_TYPES.MODAL}
          >
            {props.children}
          </ErrorBoundaryComponent>
        </div>
      </div>
    </FocusTrap>
  );
});

ModalWrapper.propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  modalDataElement: PropTypes.string.isRequired,
  closeButtonDataElement: PropTypes.string,
  backButtonDataElement: PropTypes.string,
  onBackClick: PropTypes.func,
  onCloseClick: PropTypes.func.isRequired,
  containerOnClick: PropTypes.func,
  swipeToClose: PropTypes.bool,
  accessibleLabel: PropTypes.string,
  onSwipedUp: PropTypes.func,
  onSwipedDown: PropTypes.func,
  children: PropTypes.node,
};

ModalWrapper.displayName = 'ModalWrapper';
export default ModalWrapper;