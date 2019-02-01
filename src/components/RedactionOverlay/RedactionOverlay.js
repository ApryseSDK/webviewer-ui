import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import ActionButton from 'components/ActionButton';
import ToolButton from 'components/ToolButton';

import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import getClassName from 'helpers/getClassName';
import downloadPdf from 'helpers/downloadPdf';

import actions from 'actions';
import selectors from 'selectors';
import core from 'core';

import './RedactionOverlay.scss';

class RedactionOverlay extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    closeElements: PropTypes.func.isRequired,
    closeOtherPopupElements: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.overlay = React.createRef();
    this.state = {
      left: 0,
      right: 'auto'
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      const {closeOtherPopupElements, closeElements, dispatch}  = this.props;

      // closeOtherPopupElements(this); // TODO want to do something like 'closeOtherPopupElements' but it doesn't work
      closeElements(['menuOverlay', 'toolsOverlay', 'viewControlsOverlay', 'searchOverlay', 'toolStylePopup']);

      core.setToolMode('AnnotationCreateRedaction');
      dispatch(actions.setActiveToolGroup('redactTools'));
      this.setState(getOverlayPositionBasedOn('redactionButton', this.overlay));
    }
  }

  handleApplyButtonClick = () => {
    const { dispatch, closeElements, openElements } = this.props;
    closeElements([ 'redactionOverlay' ]);
    
    const result = confirm(`Applying redactions will permanently update the document removing all content marked for redaction. Once applied, it cannot be undone.
    Are you sure you want to continue?`);

    if (result) {
      core.applyRedactions(null).then(function(results) {
      if(results && results.url) { // when are using Webviewer Server, it'll return an url for the redacted document
       downloadPdf(dispatch, {
          filename: 'redacted.pdf',
          includeAnnotations: true, 
          externalURL: results.url
        }); //download file when using WebViewer Server
        }
      });
    }
  }

  render() {
    const { left, right } = this.state;
    const { isDisabled, isOpen } = this.props;

    if (isDisabled || !isOpen || !core.isCreateRedactionEnabled()) {
      return null;
    }
    
    const className = getClassName('Overlay RedactionOverlay', this.props);

    return ( // TODO ask if there an easy way to keep the tool group as "redact"
    <div className={className} ref={this.overlay} style={{ left, right }} data-element="redactionOverlay" onMouseDown={e => e.stopPropagation()}>
        <ToolButton toolName="AnnotationCreateRedaction" />
        <ActionButton dataElement="applyAllButton" title="action.redactAll" img="ic_annotation_apply_redact_black_24px" onClick={this.handleApplyButtonClick}/>
    </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'redactionOverlay'),
  isOpen: selectors.isElementOpen(state, 'redactionOverlay'),
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  closeElements: dataElements => dispatch(actions.closeElements(dataElements)),
  closeOtherPopupElements: dataElements => dispatch(actions.closeOtherPopupElements(dataElements)),
  openElements: dataElements => dispatch(actions.openElements(dataElements)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(RedactionOverlay));
