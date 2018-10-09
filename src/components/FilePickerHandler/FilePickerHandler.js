import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import core from 'core';
import { supportedPDFExtensions, supportedOfficeExtensions } from 'constants/supportedFiles';
import loadDocument from 'helpers/loadDocument';
import actions from 'actions';
import selectors from 'selectors';

import './FilePickerHandler.scss';

class FilePickerHandler extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object.isRequired,
    advanced: PropTypes.object.isRequired,
    isDisabled: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    setDocumentFile: PropTypes.func.isRequired,
    openElement: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.accepted = [
      supportedPDFExtensions.map(extension => '.' + extension),
      supportedOfficeExtensions.map(extension => '.' + extension),
      '.xod'
    ].join(', ');
  }

  openDocument = e => {
    const file = e.target.files[0];
    if (file) {
      this.props.setDocumentFile(file);
      this.props.openElement('loadingModal');
      this.props.closeElement('menuOverlay');
      core.closeDocument().then(() => {
        loadDocument({ document: this.props.document, advanced: this.props.advanced }, this.props.dispatch);
      });
    }
  }

  render() {
    if (this.props.isDisabled) {
      return null;
    }

    return (
      <div className="FilePickerHandler">
        <input id="file-picker" type="file" accept={this.accepted} onChange={this.openDocument} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  document: selectors.getDocument(state),
  advanced: selectors.getAdvanced(state),
  isDisabled: selectors.isElementDisabled(state, 'filePickerHandler')
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  setDocumentFile: documentFile => dispatch(actions.setDocumentFile(documentFile)),
  openElement: dataElement => dispatch(actions.openElement(dataElement)),
  closeElement: dataElement => dispatch(actions.closeElement(dataElement)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FilePickerHandler);