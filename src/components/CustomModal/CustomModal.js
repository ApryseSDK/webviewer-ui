import React, { useState } from 'react';
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

  const headerRefs = React.useRef([]);
  headerRefs.current = customModals.map((element, i) => headerRefs.current[i] ?? React.createRef());

  const bodyRefs = React.useRef([]);
  bodyRefs.current = customModals.map((element, i) => bodyRefs.current[i] ?? React.createRef());

  const footerRefs = React.useRef([]);
  footerRefs.current = customModals.map((element, i) => footerRefs.current[i] ?? React.createRef());

  return customModals.map((customModalItem, index) => {
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

    const appendToComponent = (el, ref) => {
      if (isDOMNode(el)) {
        if (ref.current[index].current) {
          ref.current[index].current.appendChild(el);
        }
      }
    };

    const createElementsForModal = (innerHTML, divRefs, children) => {
      if (innerHTML) {
        appendToComponent(innerHTML, divRefs);
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
          const currentRef = divRefs.current[index];
          if (currentRef && currentRef.current) {
            const el = currentRef.current.querySelector(`.customEl${i}`);
            if (el) {
              currentRef.current.replaceChild(div, el);
            } else {
              currentRef.current.appendChild(div);
            }
          }
        });
      }
    };

    if (header) {
      const { className, style, children = [], innerHTML = null } = header;
      let { title } = header;
      title = (title && !innerHTML) ? <p>{title}</p> : null;
      createElementsForModal(innerHTML, headerRefs, children);

      headerDiv = <div
        ref={headerRefs.current[index]}
        className={`CustomModal-header ${className}`}
        style={style}
      >{title}</div>;
    }

    if (body) {
      const { className, style, children = [], innerHTML = null } = body;
      let { title } = body;
      title = (title && !innerHTML) ? <p>{title}</p> : null;
      createElementsForModal(innerHTML, bodyRefs, children);

      bodyDiv = <div
        ref={bodyRefs.current[index]}
        className={`CustomModal-body ${className}`}
        style={style}
      >{title}</div>;
    }

    if (footer) {
      const { className, style, children = [], innerHTML = null } = footer;
      let { title } = footer;
      title = (title && !innerHTML) ? <p>{title}</p> : null;
      createElementsForModal(innerHTML, footerRefs, children);

      footerDiv = <div
        ref={footerRefs.current[index]}
        className={`CustomModal-footer ${className}`}
        style={style}
      >{title}</div>;
    }

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

export default React.memo(CustomModal);
