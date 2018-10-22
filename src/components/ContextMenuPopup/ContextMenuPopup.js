import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ActionButton from 'components/ActionButton';

import getClassName from 'helpers/getClassName';
import setToolModeAndGroup from 'helpers/setToolModeAndGroup';
import actions from 'actions';
import selectors from 'selectors';

import './ContextMenuPopup.scss';

class ContextMenuPopup extends React.PureComponent {
  static propTypes = {
    isAnnotationToolsEnabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    isDisabled: PropTypes.bool,
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
    document.addEventListener('contextmenu', this.onContextMenu);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements([ 'annotationPopup', 'textPopup' ]);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('contextmenu', this.onContextMenu);
  }

  onContextMenu = e => {
    e.preventDefault();

    const { left, top } = this.getPopupPosition(e);

    this.setState({ left, top });
    this.props.openElement('contextMenuPopup');
  }

  getPopupPosition = e => {
    let { pageX: left, pageY: top } = e;

    if (this.popup.current) {
      const { width, height } = this.popup.current.getBoundingClientRect();
      const documentContainer = document.getElementsByClassName('DocumentContainer')[0];
      const containerBox = documentContainer.getBoundingClientRect();
      const horizontalGap = 2;
      const verticalGap = 2;

      if (left < containerBox.left) {
        left = containerBox.left + horizontalGap;
      }
      if (left + width > containerBox.right) {
        left = containerBox.right - width - horizontalGap;
      }

      if (top < containerBox.top) {
        top = containerBox.top + verticalGap;
      }
      if (top + height > containerBox.bottom) {
        top = containerBox.bottom - height - verticalGap;
      }
    }

    return { left, top };
  }

  handleClick = (toolName, group = '') => {
    const { dispatch, closeElement } = this.props;
    setToolModeAndGroup(dispatch, toolName, group);
    closeElement('contextMenuPopup');
  }


  render() {
    const { isDisabled, isAnnotationToolsEnabled } = this.props;
   
    if (isDisabled) { 
      return null;
    }
   
    const { left, top } = this.state;
    const className = getClassName('Popup ContextMenuPopup', this.props);

    return (
      <div className={className} ref={this.popup} data-element={'contextMenuPopup'} style={{ left, top }} onMouseDown={e => e.stopPropagation()}>
        <ActionButton dataElement="panToolButton" title="tool.pan" img="ic_pan_black_24px" onClick={() => this.handleClick('Pan')} />
        {isAnnotationToolsEnabled &&
          <React.Fragment>
            <ActionButton dataElement="stickyToolButton" title="tool.sticky" img="ic_annotation_sticky_note_black_24px" onClick={() => this.handleClick('AnnotationCreateSticky')} />
            <ActionButton dataElement="highlightToolButton" title="tool.highlight" img="ic_annotation_highlight_black_24px" onClick={() => this.handleClick('AnnotationCreateTextHighlight', 'textTools')} />
            <ActionButton dataElement="freeHandToolButton" title="tool.freehand" img="ic_annotation_freehand_black_24px" onClick={() => this.handleClick('AnnotationCreateFreeHand', 'freeHandTools')} />
            <ActionButton dataElement="freeTextToolButton" title="tool.freetext" img="ic_annotation_freetext_black_24px" onClick={() => this.handleClick('AnnotationCreateFreeText')} />
          </React.Fragment>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAnnotationToolsEnabled: !selectors.isElementDisabled(state, 'annotations') && !selectors.isDocumentReadOnly(state),
  isOpen: selectors.isElementOpen(state, 'contextMenuPopup'),
  isDisabled: selectors.isElementDisabled(state, 'contextMenuPopup')
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  openElement: dataElement => dispatch(actions.openElement(dataElement)),
  closeElement: dataElement => dispatch(actions.closeElement(dataElement)),
  closeElements: dataElements => dispatch(actions.closeElements(dataElements))
});

export default connect(mapStateToProps, mapDispatchToProps)(ContextMenuPopup);