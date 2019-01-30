import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import core from 'core';
import getClassName from 'helpers/getClassName';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import actions from 'actions';
import selectors from 'selectors';

class SignatureOverlay extends React.PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool,
    isDisabled: PropTypes.bool,
    closeElements: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.signatureTool = core.getTool('AnnotationCreateSignature');
    this.overlay = React.createRef();
    this.state = {
      defaultSignatures: [],
      left: 0,
      right: 'auto'
    };
  }

  componentDidMount() {
    this.signatureTool.on('saveDefault', this.onSaveDefault);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements(['viewControlsOverlay', 'searchOverlay', 'menuOverlay', 'toolsOverlay', 'zoomOverlay', 'toolStylePopup']);
      this.setState(getOverlayPositionBasedOn('signatureToolButton', this.overlay));
    }
  }

  componentWillUnmount() {
    this.signatureTool.off('saveDefault', this.onSaveDefault);
  }

  onSaveDefault = () => {

  }

  render() {
    const { left, right } = this.state;
    const className = getClassName('Overlay SignatureOverlay', this.props);

    if (this.props.isDisabled) {
      return null;
    }

    return(
      <div className={className} ref={this.overlay} style={{ left, right }} onClick={e => e.stopPropagation()}>
        Hello
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'signatureOverlay'),
  isOpen: selectors.isElementOpen(state, 'signatureOverlay')
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
  closeElement: actions.closeElement
};

export default connect(mapStateToProps, mapDispatchToProps)(SignatureOverlay);