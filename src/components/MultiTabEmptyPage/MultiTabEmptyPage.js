import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import DataElements from 'constants/dataElement';
import classNames from 'classnames';
import actions from 'actions';
import selectors from 'selectors';
import FilePickerPanel from 'components/PageReplacementModal/FilePickerPanel';
import './MultiTabEmptyPage.scss';

const MultiTabEmptyPage = (props) => {
  const {
    isDisabled,
    isOpen,
    tabManager,
    closeElements
  } = props;

  useEffect(() => {
    if (isOpen) {
      closeElements([
        'documentContainer',
        'pageNavOverlay',
        'notesPanel',
        'searchPanel',
        'leftPanel',
      ]);
    }
  }, [isOpen]);

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

const mapStateToProps = (state) => ({
  isDisabled: selectors.isElementDisabled(state, DataElements.MULTITABS_EMPTY_PAGE),
  isOpen: selectors.getIsMultiTab(state) && selectors.getTabs(state).length === 0,
  tabManager: selectors.getTabManager(state)
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MultiTabEmptyPage);
