import React, { useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
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

const isReactElement = (element) => React.isValidElement(element);

const CustomModalItemPropTypes = {
  dataElement: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  render: PropTypes.func,
  element: PropTypes.object,
  close: PropTypes.func,
  disableBackdropClick: PropTypes.bool,
  disableEscapeKeyDown: PropTypes.bool,
};

function CustomModalItem(props) {
  const { dataElement, isOpen, element, render, close, disableBackdropClick, disableEscapeKeyDown } = props;
  const [usedElement, setUsedElement] = useState(element);
  const modalRef = React.useRef();

  React.useLayoutEffect(function renderCustomModal() {
    if (render && isOpen && modalRef.current) {
      modalRef.current.focus();
      let el = render();
      if (typeof el === 'string') {
        el = document.createTextNode(el);
      }
      // Only support React components through the render function
      if (isReactElement(el)) {
        setUsedElement(el);
      } else if (isDOMNode(el)) {
        while (modalRef.current.firstChild) {
          modalRef.current.removeChild(modalRef.current.lastChild);
        }
        modalRef.current.appendChild(el);
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
    <div
      role="button"
      tabIndex="-1"
      className={classNames.join(' ')}
      data-element={dataElement}
      onClick={onClickOutsideModal}
    >
      {/* This element is not interactive. Reason to have onclick is to prevent propagation */}
      <div ref={modalRef} className="CustomModal-container" onClick={(e) => e.stopPropagation()}>{usedElement}</div>
    </div>
  );
}

CustomModalItem.propTypes = CustomModalItemPropTypes;

function CustomModal() {
  const [customModals, openElements, disableElements] = useSelector(
    (state) => [
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

  return customModals.map((customModalItem) => {
    const { dataElement, disableBackdropClick = false, disableEscapeKeyDown = false } = customModalItem;
    let { render } = customModalItem;
    const isModalOpen = openElements[dataElement];
    const disableElement = disableElements[dataElement];
    if (disableElement && disableElement.disabled === true) {
      // avoid rendering component if it is disabled
      return null;
    }

    const { header, body, footer } = customModalItem;

    let headerDiv = null;
    let bodyDiv = null;
    let footerDiv = null;

    headerDiv = <ModalSection type="header" data={header}  />;
    bodyDiv = <ModalSection type="body" data={body} />;
    footerDiv = <ModalSection type="footer" data={footer} />;

    let element = null;
    if (header || body || footer) {
      element = <React.Fragment>{headerDiv}{bodyDiv}{footerDiv}</React.Fragment>;
      render = null;
    }
    return (
      <CustomModalItem
        key={dataElement}
        dataElement={dataElement}
        isOpen={isModalOpen}
        render={render}
        element={element}
        close={closeCustomModalElement}
        disableBackdropClick={disableBackdropClick}
        disableEscapeKeyDown={disableEscapeKeyDown}
      />
    );
  }).filter(Boolean);
}

const ModalSection = ({ type, data }) => {
  if (!data) {
    return null;
  }

  const ref = React.useRef(null);

  const { className, style, innerHTML = null, children = [] } = data;
  let { title } = data;
  const titleElement = (title && !innerHTML) ? <p>{title}</p> : null;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    createElementsForModal(innerHTML, el, children);
  }, [innerHTML, children]);

  return (
    <div
      ref={ref}
      className={`CustomModal-${type} ${className}` || ''}
      style={style}
    >{titleElement}</div>
  );

};

const appendToComponent = (el, ref) => {
  if (isDOMNode(el)) {
    ref.appendChild(el);
  }
};

const createElementsForModal = (innerHTML, ref, children) => {
  if (innerHTML) {
    appendToComponent(innerHTML, ref);
  } else if (children && children.length) {
    children.forEach((child, i) => {
      let div;
      if (isDOMNode(child)) {
        child.classList.add(`customEl${i}`);
        div = child;
      } else {
        const { title, button, style, onClick = null } = child;
        let { className } = child;
        div = (button) ? document.createElement('button') : document.createElement('div');
        className = (button) ? `Button ${className}` : className;
        className?.split(' ').forEach((name) => div.classList.add(name));

        div.classList.add(`customEl${i}`);
        div.innerText = title;
        div.onclick = onClick;

        if (style) {
          div.style = (Object.entries(style).map(([k, v]) => (Number.isInteger(v) ? `${k}:${v}px` : `${k}:${v}`)).join(';'));
        }
      }

      const el = ref.querySelector(`.customEl${i}`);
      if (el) {
        ref.replaceChild(div, el);
      } else {
        ref.appendChild(div);
      }
    });
  }
};

export default React.memo(CustomModal);
