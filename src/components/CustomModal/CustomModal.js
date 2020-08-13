import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import actions from 'actions';
import selectors from 'selectors';

import './CustomModal.scss';

function isDOMNode(element) {
  try {
    return (
      element instanceof window.Node ||
      element instanceof window.parent.Node
    );
  } catch (e) {
    return false;
  }
}

const CustomModalItemPropTypes = {
  dataElement: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  render: PropTypes.func.isRequired,
  close: PropTypes.func,
  disableBackdropClick: PropTypes.bool,
  disableEscapeKeyDown: PropTypes.bool,
};

function CustomModalItem(props) {
  const { dataElement, isOpen, render, close, disableBackdropClick, disableEscapeKeyDown } = props;
  const modalRef = React.useRef();

  React.useLayoutEffect(function renderCustomModal() {
    if (render && isOpen && modalRef.current) {
      modalRef.current.focus();
      let element = render();
      if (typeof element === 'string') {
        element = document.createTextNode(element);
      }
      if (isDOMNode(element)) {
        while (modalRef.current.firstChild) {
          modalRef.current.removeChild(modalRef.current.lastChild);
        }
        modalRef.current.appendChild(element);
      }
    }
  }, [isOpen, render]);

  const onClickOutsideModal = React.useCallback(function onClickOutsideModal() {
    if (!disableBackdropClick) {
      close(dataElement);
    }
  }, [close, dataElement, disableBackdropClick]);

  const onKeyDownOutsideModal = React.useCallback(function onClickOutsideModal(event) {
    if (event && event.which === 27 && !disableEscapeKeyDown) {
      close(dataElement);
    }
  }, [close, dataElement, disableEscapeKeyDown]);

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', onKeyDownOutsideModal);
      return function cleanUp() {
        document.removeEventListener('keydown', onKeyDownOutsideModal);
      };
    }
  }, [onKeyDownOutsideModal, isOpen]);


  const classNames = ['Modal CustomModal'];
  classNames.push(dataElement);
  if (isOpen) {
    classNames.push('open');
  } else {
    classNames.push('closed');
  }

  return (
    // Disable key-events for modal element as we attach keydown for Escape to document
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      role="button"
      tabIndex="-1"
      className={classNames.join(' ')}
      data-element={dataElement}
      onClick={onClickOutsideModal}
    >
      {/* This element is not interactive. Reason to have onclick is to prevent propagation */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div ref={modalRef} className="CustomModal-container" onClick={e => e.stopPropagation()} />
    </div>
  );
}

CustomModalItem.propTypes = CustomModalItemPropTypes;

function CustomModal() {
  const [customModals, openElements, disableElements] = useSelector(
    state => [
      selectors.getCustomModals(state),
      selectors.getOpenElements(state),
      selectors.getDisabledElements(state),
    ],
    shallowEqual,
  );

  const dispatch = useDispatch();
  const closeCustomModalElement = React.useCallback(function closeCustomModalElementCallback(dataElement) {
    dispatch(actions.closeElement(dataElement));
  }, [dispatch]);

  return customModals.map(function customModalsMap(customModalItem) {
    const { dataElement, render, disableBackdropClick = false, disableEscapeKeyDown = false } = customModalItem;
    const isModalOpen = openElements[dataElement];
    const disableElement = disableElements[dataElement];
    if (disableElement && disableElement.disabled === true) {
      // avoid rendering component if it is disabled
      return null;
    }

    return (
      <CustomModalItem
        key={dataElement}
        dataElement={dataElement}
        isOpen={isModalOpen}
        render={render}
        close={closeCustomModalElement}
        disableBackdropClick={disableBackdropClick}
        disableEscapeKeyDown={disableEscapeKeyDown}
      />
    );
  }).filter(Boolean);
}

export default React.memo(CustomModal);
