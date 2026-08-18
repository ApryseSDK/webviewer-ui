import { useRef, useEffect, useContext } from 'react';
import getRootNode from 'helpers/getRootNode';
import InstanceRootNodeContext from 'src/context/InstanceRootNodeContext';

/**
 * Creates DOM element to be used as React root.
 * @ignore
 * @returns {HTMLElement}
 */
function createRootElement(id) {
  const rootContainer = document.createElement('div');
  rootContainer.setAttribute('id', id);
  return rootContainer;
}

/**
 * Appends element as last child of the instance root (ShadowRoot in WC mode) or document.body in iframe mode; uses the per-instance root from context instead of the module-level singleton getRootNode() so each popup/modal portal stays inside its own instance's shadow DOM in multi-instance WC mode.
 * @ignore
 * @param {HTMLElement} rootElem
 * @param {ShadowRoot|Document} instanceRoot
 */
function addRootElement(rootElem, instanceRoot) {
  const node = (window.isApryseWebViewerWebComponent) ? instanceRoot : document.body;
  if (node.lastElementChild) {
    node.insertBefore(
      rootElem,
      node.lastElementChild.nextElementSibling,
    );
    return;
  }
  node.appendChild(rootElem);
}

/**
 * Hook to create a React Portal.
 * Automatically handles creating and tearing-down the root elements (no SRR
 * makes this trivial), so there is no need to ensure the parent target already
 * exists.
 * @ignore
 * @example
 * const target = usePortal(id, [id]);
 * return createPortal(children, target);
 * @param {String} id The id of the target container, e.g 'modal' or 'spotlight'
 * @returns {HTMLElement} The DOM node to use as the Portal target.
 */
function usePortal(id) {
  const rootElemRef = useRef(null);
  const instanceRoot = useContext(InstanceRootNodeContext);
  const effectiveRoot = instanceRoot || getRootNode();
  useEffect(function setupElement() {
    // Look for existing target dom element to append to
    const queryRoot = typeof effectiveRoot?.querySelector === 'function' ? effectiveRoot : document;
    const existingParent = queryRoot.querySelector(`#${id}`);
    // Parent is either a new root or the existing dom element
    const parentElem = existingParent || createRootElement(id);

    // If there is no existing DOM element, add a new one.
    if (!existingParent) {
      addRootElement(parentElem, effectiveRoot);
    }

    // Add the detached element to the parent
    parentElem.appendChild(rootElemRef.current);

    return function removeElement() {
      rootElemRef.current.remove();
      if (!parentElem.childElementCount) {
        parentElem.remove();
      }
    };
  }, [id]);

  /**
   * It's important we evaluate this lazily:
   * - We need first render to contain the DOM element, so it shouldn't happen
   *   in useEffect. We would normally put this in the constructor().
   * - We can't do 'const rootElemRef = useRef(document.createElement('div))',
   *   since this will run every single render (that's a lot).
   * - We want the ref to consistently point to the same DOM element and only
   *   ever run once.
   * @link https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
   */
  function getRootElem() {
    if (!rootElemRef.current) {
      rootElemRef.current = document.createElement('div');
    }
    return rootElemRef.current;
  }

  return getRootElem();
}

export default usePortal;
