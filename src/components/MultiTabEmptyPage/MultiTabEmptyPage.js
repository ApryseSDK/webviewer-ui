import React, { useLayoutEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import DataElements from 'constants/dataElement';
import classNames from 'classnames';
import actions from 'actions';
import selectors from 'selectors';
import FilePickerPanel from 'components/PageReplacementModal/FilePickerPanel';
import './MultiTabEmptyPage.scss';

const MultiTabEmptyPage = () => {
  const [
    isDisabled,
    isOpen,
    tabManager
  ] = useSelector(
    (state) => [
      selectors.isElementDisabled(state, DataElements.MULTITABS_EMPTY_PAGE),
      selectors.isElementOpen(state, DataElements.MULTITABS_EMPTY_PAGE),
      selectors.getTabManager(state),
    ],
    shallowEqual,
  );

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (isOpen) {
      dispatch(actions.closeElements([
        'documentContainer',
        'pageNavOverlay',
        'notesPanel',
        'searchPanel',
        'leftPanel',
      ]));
    }
  }, [dispatch, isOpen]);

  if (isDisabled) {
    return null;
  }

  const addNewTab = (file) => {
    tabManager.addTab(file, { setActive: true });
  };

  return (
    <div
      className={classNames({
        MultiTabEmptyPage: true,
        'closed': !isOpen
      })}
      data-element={DataElements.MULTITABS_EMPTY_PAGE}
    >
      {isOpen && (
        <div className="empty-page-body">
          <FilePickerPanel
            onFileProcessed={(file) => addNewTab(file)}
            shouldShowIcon={true}
          />
        </div>
      )}
    </div>
  );
};

export default MultiTabEmptyPage;
