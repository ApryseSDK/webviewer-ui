import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ActionButton from 'components/ActionButton';

import core from 'core';
import { getTextPopupPositionBasedOn } from 'helpers/getPopupPosition';
import getClassName from 'helpers/getClassName';
import createTextAnnotationAndSelect from 'helpers/createTextAnnotationAndSelect';
import copyText from 'helpers/copyText';
import actions from 'actions';
import selectors from 'selectors';

import './TextPopup.scss';

class TextPopup extends React.PureComponent {
  static propTypes = {
    isAnnotationToolsEnabled: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    openElement: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    closeElements: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.popup = React.createRef();
    this.state = {
      left: 0,
      top: 0
    };
  }

  componentDidMount() {
    this.highlightText = createTextAnnotationAndSelect.bind(this, this.props.dispatch, window.Annotations.TextHighlightAnnotation);
    this.underlineText = createTextAnnotationAndSelect.bind(this, this.props.dispatch, window.Annotations.TextUnderlineAnnotation);
    this.squigglyText = createTextAnnotationAndSelect.bind(this, this.props.dispatch, window.Annotations.TextSquigglyAnnotation);
    this.strikeoutText = createTextAnnotationAndSelect.bind(this, this.props.dispatch, window.Annotations.TextStrikeoutAnnotation);
    core.getTool('TextSelect').on('selectionComplete', this.onSelectionComplete);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements([ 'annotationPopup', 'contextMenuPopup' ]);
    }
  }

  componentWillUnmount() {
    core.getTool('TextSelect').off('selectionComplete', this.onSelectionComplete);
  }

  onSelectionComplete = (e, startQuad, allQuads) => {
    this.positionTextPopup(allQuads);
    this.props.openElement('textPopup');
  }

  positionTextPopup = allQuads => {
    const { left, top } = getTextPopupPositionBasedOn(allQuads, this.popup);

    this.setState({ left, top });
  }

  onClickCopy = () => {
    copyText();
    this.props.closeElement('textPopup');
  }

  render() {
    if (this.props.isDisabled) {
      return null;
    }

    const { left, top } = this.state;
    const className = getClassName('Popup TextPopup', this.props);

    return (
      <div className={className} data-element={'textPopup'} ref={this.popup} style={{ left, top }} onMouseDown={e => e.stopPropagation()}>
        <ActionButton dataElement="copyTextButton" title="action.copy" img="ic_copy_black_24px" onClick={this.onClickCopy} />
        {this.props.isAnnotationToolsEnabled &&
          <React.Fragment>
            <ActionButton dataElement="textHighlightToolButton" title="annotation.highlight" img="ic_annotation_highlight_black_24px" onClick={this.highlightText} />
            <ActionButton dataElement="textUnderlineToolButton" title="annotation.underline" img="ic_annotation_underline_black_24px" onClick={this.underlineText} />
            <ActionButton dataElement="textSquigglyToolButton" title="annotation.squiggly" img="ic_annotation_squiggly_black_24px" onClick={this.squigglyText} />
            <ActionButton dataElement="textStrikeoutToolButton" title="annotation.strikeout" img="ic_annotation_strikeout_black_24px" onClick={this.strikeoutText} />
          </React.Fragment>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAnnotationToolsEnabled: !selectors.isElementDisabled(state, 'annotations') && !selectors.isDocumentReadOnly(state),
  isDisabled: selectors.isElementDisabled(state, 'textPopup'),
  isOpen: selectors.isElementOpen(state, 'textPopup'),
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  openElement: dataElement => dispatch(actions.openElement(dataElement)),
  closeElement: dataElement => dispatch(actions.closeElement(dataElement)),
  closeElements: dataElements => dispatch(actions.closeElements(dataElements)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TextPopup);