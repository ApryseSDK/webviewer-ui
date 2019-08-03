import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import StylePopup from 'components/StylePopup';

import getClassName from 'helpers/getClassName';
import setToolStyles from 'helpers/setToolStyles';
import actions from 'actions';
import selectors from 'selectors';

import './ToolStylePopup.scss';

class ToolStylePopup extends React.PureComponent {
  static propTypes = {
    activeToolName: PropTypes.string,
    activeToolStyle: PropTypes.object,
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    colorMapKey: PropTypes.string,
    closeElement: PropTypes.func.isRequired,
    closeElements: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.popup = React.createRef();
    this.state = {
      left: 0,
      top: 0,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen && !this.props.isDisabled) {
      this.props.closeElements([
        'viewControlsOverlay',
        'searchOverlay',
        'menuOverlay',
        'signatureOverlay',
        'zoomOverlay',
        'redactionOverlay',
      ]);
      this.positionToolStylePopup();
    }

    const selectedAnotherTool =
      prevProps.activeToolName !== this.props.activeToolName;
    if (selectedAnotherTool && !this.props.isDisabled) {
      this.positionToolStylePopup();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.props.closeElement('toolStylePopup');
  };

  handleStyleChange = (property, value) => {
    setToolStyles(this.props.activeToolName, property, value);
  };

  positionToolStylePopup = () => {
    const { dataElement } = this.props;
    let toolButton = undefined;
    if (dataElement) {
      toolButton = document.querySelectorAll(`.Header [data-element=${dataElement}], .GroupOverlay [data-element=${dataElement}]`)[0];
      if (!toolButton) {
        toolButton = document.querySelectorAll(`.ResponsiveOverlay [data-element=${dataElement}], .GroupOverlay [data-element=${dataElement}]`)[0];
      }
      if (!toolButton) {
        return;
      }
    } else {
      return;
    }

    const { left, top } = this.getToolStylePopupPositionBasedOn(
      toolButton,
      this.popup
    );

    this.setState({ left, top });
  };

  getToolStylePopupPositionBasedOn = (toolButton, popup) => {
    const buttonRect = toolButton.getBoundingClientRect();
    const popupRect = popup.current.getBoundingClientRect();
    const buttonCenter = (buttonRect.left + buttonRect.right) / 2;
    const popupTop = buttonRect.bottom + 1;
    let popupLeft = buttonCenter - popupRect.width / 2;
    const popupRight = buttonCenter + popupRect.width / 2;

    popupLeft =
      popupRight > window.innerWidth
        ? window.innerWidth - popupRect.width - 12
        : popupLeft;
    popupLeft = popupLeft < 0 ? 0 : popupLeft;

    return { left: popupLeft, top: popupTop };
  };

  onClick = e => {
    e.stopPropagation();

    this.props.closeElement('toolStylePopup');
  };

  render() {
    const { left, top } = this.state;
    const { isDisabled, activeToolName, activeToolStyle, dataElement } = this.props;
    const isFreeText = activeToolName === 'AnnotationCreateFreeText';
    const className = getClassName(`Popup ToolStylePopup`, this.props);

    if (isDisabled) {
      return null;
    }
    const hideSlider = activeToolName === 'AnnotationCreateRedaction';
    
    return (
      <div
        className={className}
        data-element="toolStylePopup"
        style={{ top, left }}
        ref={this.popup}
        onMouseDown={e => e.stopPropagation()}
        onClick={this.onClick}
      >
        <StylePopup
          key={activeToolName}
          activeToolName={activeToolName}
          style={activeToolStyle}
          isFreeText={isFreeText}
          hideSlider={hideSlider}
          onStyleChange={this.handleStyleChange}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeToolName: selectors.getActiveToolName(state),
  activeToolStyle: selectors.getActiveToolStyles(state),
  isDisabled: selectors.isElementDisabled(state, 'toolStylePopup'),
  isOpen: selectors.isElementOpen(state, 'toolStylePopup'),
  toolButtonObjects: selectors.getToolButtonObjects(state),
  dataElement: selectors.getActiveDataElement(state)
});

const mapDispatchToProps = {
  closeElement: actions.closeElement,
  closeElements: actions.closeElements,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolStylePopup);
