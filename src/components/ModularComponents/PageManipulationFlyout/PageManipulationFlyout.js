import { useEffect } from 'react';
import DataElements from 'constants/dataElement';
import actions from 'actions';
import { useStore } from 'react-redux';
import {
  getPageAdditionalControls,
  getPageRotationControls,
  getPageManipulationControls
} from 'helpers/pageManipulationFlyoutHelper';
import core from 'core';

const propTypes = {};

const PageManipulationFlyout = () => {
  const store = useStore();

  useEffect(() => {
    const flyout = {
      dataElement: DataElements.PAGE_MANIPULATION,
      className: DataElements.PAGE_MANIPULATION,
      items: [
        ...getPageAdditionalControls(store),
        'divider',
        ...getPageRotationControls(store),
        'divider',
        ...getPageManipulationControls(store),
      ]
    };

    const onDocumentLoaded = () => store.dispatch(actions.closeElements([flyout.dataElement]));

    core.addEventListener('documentLoaded', onDocumentLoaded);

    store.dispatch(actions.updateFlyout(flyout.dataElement, flyout));

    return () => {
      core.removeEventListener('documentLoaded', onDocumentLoaded);
    };
  }, [store]);

  return null;
};

PageManipulationFlyout.propTypes = propTypes;

export default PageManipulationFlyout;