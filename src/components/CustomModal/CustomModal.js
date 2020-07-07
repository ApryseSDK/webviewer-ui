import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from "react-redux";
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
};

function CustomModalItem(props) {
  const { dataElement, isOpen, render } = props;
  const modalRef = React.useRef();

  React.useLayoutEffect(function renderCustomModal() {
    if (render && isOpen && modalRef.current) {
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

  const classNames = ['Modal CustomModal'];
  classNames.push(dataElement);
  if (isOpen) {
    classNames.push('open');
  } else {
    classNames.push('closed');
  }

  return (
    <div ref={modalRef} className={classNames.join(' ')} data-element={dataElement} />
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

  return customModals.map(function customModalsMap(customModalItem) {
    const { dataElement, render } = customModalItem;
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
      />
    );
  }).filter(Boolean);
}

export default CustomModal;
